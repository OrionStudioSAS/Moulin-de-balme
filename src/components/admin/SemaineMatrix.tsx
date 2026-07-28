"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types";

const DAYS = ["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"] as const;
const DAYS_LABELS: Record<string, string> = {
  lundi: "Lun", mardi: "Mar", mercredi: "Mer",
  jeudi: "Jeu", vendredi: "Ven", samedi: "Sam", dimanche: "Dim",
};

export default function SemaineMatrix({
  products,
  allProducts,
}: {
  products: Product[];
  allProducts: Product[];
}) {
  const [items, setItems]       = useState<Product[]>(products);
  const [search, setSearch]     = useState("");
  const [pending, startTransition] = useTransition();
  const supabase = createClient();

  const toggleDay = (productId: string, day: string) => {
    startTransition(async () => {
      const product = items.find((p) => p.id === productId)!;
      const has = product.available_days.includes(day);
      const newDays = has
        ? product.available_days.filter((d) => d !== day)
        : [...product.available_days, day];

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
        .update({ is_semaine: false })
        .eq("id", productId);

      if (!error) {
        setItems((prev) => prev.filter((p) => p.id !== productId));
      }
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
    (p) =>
      !items.find((i) => i.id === p.id) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Recherche pour ajouter un produit */}
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
            ) : (
              filteredAll.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToSemaine(p)}
                  disabled={pending}
                  className="w-full text-left px-3 py-2 text-sm text-brown hover:bg-cream transition-colors border-b border-brown/10 last:border-0"
                >
                  {p.name}
                  {p.category && (
                    <span className="text-brown/40 ml-2 text-xs">· {p.category.name}</span>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Matrice produits × jours */}
      {items.length === 0 ? (
        <p className="text-sm text-warm-gray text-center py-12">
          Aucun produit dans la semaine — utilisez la recherche ci-dessus.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-brown/20">
                <th className="text-left px-3 py-2 text-xs font-bold tracking-widest uppercase text-warm-gray w-[280px]">
                  Produit
                </th>
                {DAYS.map((d) => (
                  <th
                    key={d}
                    className="text-center px-2 py-2 text-xs font-bold tracking-widest uppercase text-warm-gray w-14"
                  >
                    {DAYS_LABELS[d]}
                  </th>
                ))}
                <th className="w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brown/10">
              {items.map((product) => (
                <tr key={product.id} className="hover:bg-cream/50">
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin/produits/${product.id}/edit`}
                      className="text-brown font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                    {product.category && (
                      <p className="text-[10px] text-warm-gray">{product.category.name}</p>
                    )}
                  </td>
                  {DAYS.map((day) => {
                    const active = product.available_days.includes(day);
                    return (
                      <td key={day} className="text-center py-3">
                        <button
                          onClick={() => toggleDay(product.id, day)}
                          disabled={pending}
                          className={`w-7 h-7 border text-xs font-bold transition-colors ${
                            active
                              ? "bg-brown border-brown text-cream"
                              : "border-brown/30 text-brown/30 hover:border-brown hover:text-brown"
                          }`}
                          title={active ? `Retirer ${day}` : `Ajouter ${day}`}
                        >
                          {active ? "✓" : ""}
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
      <div className="grid grid-cols-7 gap-2">
        {DAYS.map((day) => {
          const dayProds = items.filter((p) => p.available_days.includes(day));
          return (
            <div key={day} className="bg-white border border-brown/20 p-3">
              <p className="text-[9px] font-bold tracking-widest uppercase text-warm-gray mb-2">
                {DAYS_LABELS[day]}
              </p>
              {dayProds.length === 0 ? (
                <p className="text-[9px] text-brown/30 italic">—</p>
              ) : (
                <ul className="space-y-1">
                  {dayProds.map((p) => (
                    <li key={p.id} className="text-[9px] text-brown leading-tight truncate">
                      · {p.name}
                    </li>
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
