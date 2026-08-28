"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types";

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const DAY_NAMES  = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toISO(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
}

export default function SemaineMatrix({
  products,
  allProducts,
}: {
  products: Product[];
  allProducts: Product[];
}) {
  const [items, setItems] = useState<Product[]>(products);
  const [search, setSearch] = useState("");
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [pending, startTransition] = useTransition();
  const supabase = createClient();

  const weekDates = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const prevWeek = () => setWeekStart((w) => { const d = new Date(w); d.setDate(d.getDate() - 7); return d; });
  const nextWeek = () => setWeekStart((w) => { const d = new Date(w); d.setDate(d.getDate() + 7); return d; });

  const weekLabel = () => {
    const end = weekDates[5];
    return `${weekStart.getDate()} – ${end.getDate()} ${end.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`;
  };

  const toggleDate = (productId: string, iso: string) => {
    startTransition(async () => {
      const product = items.find((p) => p.id === productId)!;
      const has = product.available_days.includes(iso);
      const newDays = has
        ? product.available_days.filter((d) => d !== iso)
        : [...product.available_days, iso].sort();

      const { error } = await supabase
        .from("products")
        .update({ available_days: newDays })
        .eq("id", productId);

      if (!error) {
        setItems((prev) =>
          prev.map((p) => p.id === productId ? { ...p, available_days: newDays } : p)
        );
      }
    });
  };

  const removeFromSemaine = (productId: string) => {
    startTransition(async () => {
      const { error } = await supabase
        .from("products")
        .update({ is_semaine: false, available_days: [] })
        .eq("id", productId);

      if (!error) setItems((prev) => prev.filter((p) => p.id !== productId));
    });
  };

  const addToSemaine = (product: Product) => {
    if (items.find((p) => p.id === product.id)) return;
    startTransition(async () => {
      const { error } = await supabase
        .from("products")
        .update({ is_semaine: true })
        .eq("id", product.id);

      if (!error) {
        setItems((prev) => [...prev, { ...product, is_semaine: true }]);
        setSearch("");
      }
    });
  };

  const filteredAll = allProducts.filter(
    (p) => !items.find((i) => i.id === p.id) && p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Recherche */}
      <div className="bg-white border border-brown/20 p-5">
        <p className="text-xs font-bold tracking-widest uppercase text-brown mb-3">
          Ajouter un produit à la semaine
        </p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit…"
          className="w-full border border-brown/20 px-3 py-2 text-sm text-brown bg-cream focus:outline-none focus:border-brown"
        />
        {search.length >= 1 && (
          <div className="border border-brown/20 border-t-0 max-h-48 overflow-y-auto">
            {filteredAll.length === 0 ? (
              <p className="px-3 py-2 text-xs text-brown/40">Aucun résultat</p>
            ) : filteredAll.map((p) => (
              <button
                key={p.id}
                onClick={() => addToSemaine(p)}
                disabled={pending}
                className="w-full text-left px-3 py-2 text-sm text-brown hover:bg-cream transition-colors border-b border-brown/10 last:border-0"
              >
                {p.name}
                {p.category && <span className="text-brown/40 ml-2 text-xs">· {p.category.name}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigateur de semaine */}
      <div className="flex items-center gap-4">
        <button onClick={prevWeek} className="border border-brown/30 px-3 py-1 text-xs text-brown hover:bg-brown hover:text-cream transition-colors">
          ← Semaine précédente
        </button>
        <span className="text-sm font-bold tracking-wider text-brown capitalize">{weekLabel()}</span>
        <button onClick={nextWeek} className="border border-brown/30 px-3 py-1 text-xs text-brown hover:bg-brown hover:text-cream transition-colors">
          Semaine suivante →
        </button>
      </div>

      {/* Matrice */}
      {items.length === 0 ? (
        <p className="text-sm text-warm-gray text-center py-12">Aucun produit — utilisez la recherche ci-dessus.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-brown/20">
                <th className="text-left px-3 py-2 text-xs font-bold tracking-widest uppercase text-warm-gray w-[240px]">
                  Produit
                </th>
                {weekDates.map((date, i) => (
                  <th key={i} className="text-center px-2 py-2 text-[10px] font-bold tracking-wide uppercase text-warm-gray w-20">
                    <div>{DAY_LABELS[i]}</div>
                    <div className="font-normal text-brown/40">{date.getDate()}/{date.getMonth() + 1}</div>
                  </th>
                ))}
                <th className="w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brown/10">
              {items.map((product) => (
                <tr key={product.id} className="hover:bg-cream/50">
                  <td className="px-3 py-3">
                    <Link href={`/admin/produits/${product.id}/edit`} className="text-brown font-medium hover:underline">
                      {product.name}
                    </Link>
                    {product.category && <p className="text-[10px] text-warm-gray">{product.category.name}</p>}
                    {product.available_days.length === 0 && (
                      <p className="text-[9px] text-green-600 mt-0.5">Toute la semaine</p>
                    )}
                  </td>
                  {weekDates.map((date, i) => {
                    const iso = toISO(date);
                    const active = product.available_days.includes(iso);
                    const allWeek = product.available_days.length === 0;
                    return (
                      <td key={i} className="text-center py-3">
                        <button
                          onClick={() => toggleDate(product.id, iso)}
                          disabled={pending}
                          title={active ? `Retirer le ${formatDayLabel(date)}` : `Ajouter le ${formatDayLabel(date)}`}
                          className={`w-8 h-8 border text-xs font-bold transition-colors ${
                            allWeek
                              ? "border-green-300 bg-green-50 text-green-400 cursor-pointer"
                              : active
                                ? "bg-brown border-brown text-cream"
                                : "border-brown/20 text-brown/20 hover:border-brown hover:text-brown"
                          }`}
                        >
                          {allWeek ? "∞" : active ? "✓" : ""}
                        </button>
                      </td>
                    );
                  })}
                  <td className="text-right pr-3 py-3">
                    <button
                      onClick={() => removeFromSemaine(product.id)}
                      disabled={pending}
                      className="text-[10px] text-red-400 hover:text-red-600 tracking-wider uppercase"
                    >
                      Retirer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Résumé par jour */}
      <div className="grid grid-cols-6 gap-2">
        {weekDates.map((date, i) => {
          const iso = toISO(date);
          const dayProds = items.filter((p) =>
            p.available_days.length === 0 || p.available_days.includes(iso)
          );
          return (
            <div key={i} className="bg-white border border-brown/20 p-3">
              <p className="text-[9px] font-bold tracking-widest uppercase text-warm-gray mb-1">
                {DAY_NAMES[i]}
              </p>
              <p className="text-[9px] text-brown/30 mb-2">{date.getDate()}/{date.getMonth() + 1}</p>
              {dayProds.length === 0 ? (
                <p className="text-[9px] text-brown/30 italic">—</p>
              ) : (
                <ul className="space-y-1">
                  {dayProds.map((p) => (
                    <li key={p.id} className="text-[9px] text-brown leading-tight truncate">· {p.name}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
