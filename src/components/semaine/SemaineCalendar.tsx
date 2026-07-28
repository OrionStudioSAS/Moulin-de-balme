"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";

const MONTHS_FR = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre",
];
const DAYS_HEADER = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
// JS getDay() → French key
const JS_TO_FR = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];

const ALL_WEEKDAYS = ["lundi","mardi","mercredi","jeudi","vendredi","samedi"];

function productType(p: Product): "semaine" | "special" | "jour" {
  if (p.badge === "exclusif") return "special";
  if (ALL_WEEKDAYS.every((d) => p.available_days.includes(d))) return "semaine";
  return "jour";
}

const TYPE_STYLE = {
  semaine:  { chip: "bg-[#4A7C59] text-white", label: "Semaine"  },
  special:  { chip: "bg-[#8B6535] text-white", label: "Spécial"  },
  jour:     { chip: "bg-[#4B6FA5] text-white", label: "Jour"     },
};

export default function SemaineCalendar({ products }: { products: Product[] }) {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  // Build calendar cells (European grid: Monday = col 0)
  const firstDay   = new Date(year, month, 1);
  const totalDays  = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7; // Mon=0…Sun=6

  type Cell = { date: number; jsDay: number } | null;
  const cells: Cell[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => {
      const d = i + 1;
      return { date: d, jsDay: new Date(year, month, d).getDay() };
    }),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const productsForDay = (frDay: string) =>
    products.filter((p) => p.available_days.includes(frDay));

  return (
    <div>
      {/* ── En-tête calendrier ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-10 pb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-cream/40 mb-2">
            Le calendrier du fournil
          </p>
          <h1 className="text-[clamp(2.2rem,4vw,4.5rem)] font-bold text-cream uppercase tracking-tight leading-none">
            Le mois<br />au fournil.
          </h1>
          <p className="text-xs text-cream/60 leading-relaxed max-w-sm mt-4">
            Chaque jour a sa propre carte au Moulin de Balme.<br />
            Les pains au levain, façonnés à la main, sont là<br />
            toute la semaine — mais certains spéciaux<br />
            ne sortent qu&apos;un jour précis.
          </p>
        </div>

        {/* Navigation mois + légende */}
        <div className="flex flex-col gap-4 items-end">
          <div className="flex items-center gap-4">
            <button
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center border border-cream/30 text-cream hover:bg-cream/10 transition-colors"
              aria-label="Mois précédent"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M7 1L3 5L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <span className="text-sm font-bold tracking-widest uppercase text-cream min-w-[120px] text-center">
              {MONTHS_FR[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center border border-cream/30 text-cream hover:bg-cream/10 transition-colors"
              aria-label="Mois suivant"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M3 1L7 5L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-cream/40 tracking-wider">
            Lundi → Samedi &nbsp;·&nbsp; 7h30 → 18h
          </p>
          {/* Légende */}
          <div className="flex flex-wrap gap-3 justify-end">
            {[
              { color: "bg-[#4A7C59]", label: "Disponible toute la semaine" },
              { color: "bg-[#4B6FA5]", label: "Produit du jour" },
              { color: "bg-[#8B6535]", label: "Spécial / Saisonnier" },
              { color: "bg-cream/20",  label: "Fermé" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-[9px] text-cream/50 tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grille calendrier ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-12">
        {/* En-têtes jours */}
        <div className="grid grid-cols-7 border-l border-t border-cream/10">
          {DAYS_HEADER.map((d) => (
            <div
              key={d}
              className="border-r border-b border-cream/10 px-2 py-2 text-[9px] font-bold tracking-widest uppercase text-cream/30"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Cellules */}
        <div className="grid grid-cols-7 border-l border-cream/10">
          {cells.map((cell, i) => {
            if (!cell) {
              return (
                <div
                  key={i}
                  className="border-r border-b border-cream/10 min-h-[110px] bg-black/20"
                />
              );
            }

            const isSunday = cell.jsDay === 0;
            const isT      = isToday(cell.date);
            const frDay    = JS_TO_FR[cell.jsDay];
            const dayProds = isSunday ? [] : productsForDay(frDay);

            return (
              <div
                key={i}
                className={`border-r border-b border-cream/10 min-h-[110px] p-2 transition-colors ${
                  isT ? "bg-cream/10" : isSunday ? "bg-black/30" : "hover:bg-cream/5"
                }`}
              >
                <span
                  className={`text-xs font-bold ${
                    isT ? "text-cream" : isSunday ? "text-cream/20" : "text-cream/50"
                  }`}
                >
                  {cell.date}
                </span>
                {isSunday && (
                  <p className="text-[8px] text-cream/20 mt-1 tracking-wider uppercase">Fermé</p>
                )}
                <div className="mt-1 space-y-1">
                  {dayProds.map((p) => {
                    const { chip, label } = TYPE_STYLE[productType(p)];
                    return (
                      <div key={p.id}>
                        <span className={`text-[7px] font-bold px-1 py-0.5 ${chip} tracking-wider uppercase`}>
                          {label}
                        </span>
                        <p className="text-[9px] text-cream/70 leading-snug mt-0.5 truncate">
                          {p.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── À DÉGUSTER CETTE SEMAINE ── */}
      {products.length > 0 && (
        <div className="bg-cream py-14">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <h2 className="text-[clamp(2.2rem,4vw,4.5rem)] font-bold uppercase tracking-tight text-black mb-8">
              À déguster<br />cette semaine
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/produits/${product.slug}`}
                  className="group flex flex-col bg-white overflow-hidden border border-brown/10 hover:border-brown/30 transition-colors"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-brown/10">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#C4A882] to-[#6B4A35]" />
                    )}
                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-cream text-brown text-[8px] font-bold tracking-widest uppercase px-2 py-0.5">
                        {product.badge === "nouveau" ? "Nouveau"
                          : product.badge === "bestseller" ? "Bestseller"
                          : "Exclusif"}
                      </span>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-brown leading-snug">
                      {product.name}
                    </p>
                    <p className="text-[9px] tracking-widest uppercase text-brown/50 mt-auto">
                      À partir de · {product.price.toFixed(2).replace(".", ",")}€
                    </p>
                    <button className="w-full border border-brown text-brown text-[9px] font-bold tracking-widest uppercase py-2 hover:bg-brown hover:text-cream transition-colors mt-1">
                      Ajouter au panier
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
