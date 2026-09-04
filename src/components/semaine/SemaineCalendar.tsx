"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";

const MONTHS_FR = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre",
];
const DAYS_HEADER_FULL   = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const DAYS_HEADER_SHORT  = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

function toISO(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function productType(p: Product): "semaine" | "special" | "jour" {
  if (p.badge === "exclusif") return "special";
  if (!p.available_days || p.available_days.length === 0) return "semaine";
  return "jour";
}

const TYPE_STYLE = {
  semaine:  { chip: "bg-[#4A7C59] text-white", label: "Semaine"  },
  special:  { chip: "bg-[#8B6535] text-white", label: "Spécial"  },
  jour:     { chip: "bg-[#4B6FA5] text-white", label: "Jour"     },
};

export default function SemaineCalendar({ products }: { products: Product[] }) {
  const today = new Date();
  const [year, setYear]     = useState(today.getFullYear());
  const [month, setMonth]   = useState(today.getMonth()); // 0-indexed
  const [mobileWeek, setMobileWeek] = useState(() => {
    // Initialise sur la semaine contenant aujourd'hui
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const offset   = (firstDay.getDay() + 6) % 7;
    return Math.floor((today.getDate() - 1 + offset) / 7);
  });

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setMobileWeek(0);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setMobileWeek(0);
  };

  // Build calendar cells (European grid: Monday = col 0)
  const firstDay    = new Date(year, month, 1);
  const totalDays   = new Date(year, month + 1, 0).getDate();
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

  const totalWeeks = cells.length / 7;

  // Découpage en semaines pour mobile
  const weeks: Cell[][] = Array.from({ length: totalWeeks }, (_, w) =>
    cells.slice(w * 7, w * 7 + 7)
  );
  const currentMobileWeek = Math.min(mobileWeek, totalWeeks - 1);
  const mobileWeekLabel = (() => {
    const row = weeks[currentMobileWeek];
    const first = row.find(Boolean);
    const last  = [...row].reverse().find(Boolean);
    if (!first || !last) return "";
    return `${first.date} – ${last.date} ${MONTHS_FR[month]}`;
  })();

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const productsForDay = (day: number) => {
    const iso = toISO(year, month, day);
    return products.filter((p) =>
      !p.available_days || p.available_days.length === 0
        ? true
        : p.available_days.includes(iso)
    );
  };

  return (
    <div>
      {/* ── En-tête calendrier ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-cream/40 mb-3">
            Le calendrier du fournil
          </p>
          <h1 className="text-[clamp(2.2rem,4vw,4.5rem)] font-bold text-cream uppercase tracking-tight leading-none">
            Le mois<br />au fournil.
          </h1>
          <div className="w-8 h-px bg-cream/30 my-5" />
          <p className="text-xs text-cream/60 leading-relaxed max-w-sm">
            Chaque jour a sa propre carte au Moulin de Balme.<br />
            Les pains au levain, façonnés à la main, sont là<br />
            toute la semaine — mais certains spéciaux<br />
            ne sortent qu&apos;un jour précis.
          </p>
        </div>

        {/* Navigation mois + légende */}
        <div className="flex flex-col gap-4 items-end">
          <div className="flex items-center gap-5">
            <button
              onClick={prevMonth}
              className="w-10 h-10 flex items-center justify-center border border-cream/30 text-cream hover:bg-cream/10 transition-colors text-lg"
              aria-label="Mois précédent"
            >
              ←
            </button>
            <span className="text-2xl font-bold tracking-widest uppercase text-cream min-w-[200px] text-center">
              {MONTHS_FR[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="w-10 h-10 flex items-center justify-center border border-cream/30 text-cream hover:bg-cream/10 transition-colors text-lg"
              aria-label="Mois suivant"
            >
              →
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
      <div className="bg-cream">
        <div className="max-w-[1400px] mx-auto px-3 md:px-12 pb-12 pt-6">

          {/* ── Navigation semaine (mobile uniquement) ── */}
          <div className="flex md:hidden items-center justify-between mb-4 px-1">
            <button
              onClick={() => setMobileWeek((w) => Math.max(0, w - 1))}
              disabled={currentMobileWeek === 0}
              className="w-9 h-9 flex items-center justify-center border border-brown/20 text-brown disabled:opacity-20 text-base"
            >
              ←
            </button>
            <span className="text-[11px] font-bold tracking-widest uppercase text-brown/60">
              {mobileWeekLabel}
            </span>
            <button
              onClick={() => setMobileWeek((w) => Math.min(totalWeeks - 1, w + 1))}
              disabled={currentMobileWeek === totalWeeks - 1}
              className="w-9 h-9 flex items-center justify-center border border-brown/20 text-brown disabled:opacity-20 text-base"
            >
              →
            </button>
          </div>

          {/* En-têtes jours — desktop uniquement */}
          <div className="hidden md:grid grid-cols-7 border-l border-t border-brown/10">
            {DAYS_HEADER_FULL.map((d) => (
              <div key={d} className="border-r border-b border-brown/10 px-2 py-2 text-[9px] font-bold tracking-widest uppercase text-brown/40">
                {d}
              </div>
            ))}
          </div>

          {/* Cellules — mobile : liste verticale | desktop : grille mensuelle */}
          {[
            /* Mobile : jours en liste verticale */
            <div key="mobile" className="md:hidden divide-y divide-brown/10 border border-brown/10">
              {weeks[currentMobileWeek]?.map((cell, i) => {
                if (!cell) return null;
                const isSunday = cell.jsDay === 0;
                const isT      = isToday(cell.date);
                const dayProds = isSunday ? [] : productsForDay(cell.date);
                return (
                  <div
                    key={i}
                    className={`flex gap-4 px-4 py-3 ${
                      isT ? "bg-gold/10" : isSunday ? "bg-brown/5" : "bg-cream"
                    }`}
                  >
                    {/* Colonne date + jour */}
                    <div className="w-14 shrink-0 flex flex-col items-center justify-start pt-0.5">
                      <span className={`text-2xl font-bold leading-none ${isT ? "text-brown" : isSunday ? "text-brown/20" : "text-brown"}`}>
                        {cell.date}
                      </span>
                      <span className={`text-[9px] font-bold tracking-widest uppercase mt-0.5 ${isSunday ? "text-brown/20" : "text-brown/40"}`}>
                        {DAYS_HEADER_SHORT[i]}
                      </span>
                    </div>
                    {/* Produits */}
                    <div className="flex-1 flex flex-col justify-center gap-1.5 min-h-[48px]">
                      {isSunday ? (
                        <p className="text-[10px] text-brown/20 tracking-wider uppercase">Fermé</p>
                      ) : dayProds.length === 0 ? (
                        <p className="text-[10px] text-brown/20 italic">—</p>
                      ) : (
                        dayProds.map((p) => {
                          const { chip, label } = TYPE_STYLE[productType(p)];
                          return (
                            <div key={p.id} className="flex items-center gap-2">
                              <span className={`text-[7px] font-bold px-1.5 py-0.5 ${chip} tracking-wider uppercase shrink-0`}>{label}</span>
                              <p className="text-[11px] text-brown/80 leading-snug truncate">{p.name}</p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>,

            /* Desktop : mois entier */
            <div key="desktop" className="hidden md:grid grid-cols-7 border-l border-brown/10">
              {cells.map((cell, i) => {
                if (!cell) {
                  return <div key={i} className="border-r border-b border-brown/10 min-h-[110px] bg-brown/5" />;
                }
                const isSunday = cell.jsDay === 0;
                const isT      = isToday(cell.date);
                const dayProds = isSunday ? [] : productsForDay(cell.date);
                return (
                  <div
                    key={i}
                    className={`border-r border-b border-brown/10 min-h-[110px] p-2 transition-colors ${
                      isT ? "bg-gold/10" : isSunday ? "bg-brown/5" : "bg-cream hover:bg-cream-dark/40"
                    }`}
                  >
                    <span className={`text-xs font-bold ${isT ? "text-brown" : isSunday ? "text-brown/20" : "text-brown/60"}`}>
                      {cell.date}
                    </span>
                    {isSunday && <p className="text-[8px] text-brown/20 mt-1 tracking-wider uppercase">Fermé</p>}
                    <div className="mt-1 space-y-1">
                      {dayProds.map((p) => {
                        const { chip, label } = TYPE_STYLE[productType(p)];
                        return (
                          <div key={p.id}>
                            <span className={`text-[7px] font-bold px-1 py-0.5 ${chip} tracking-wider uppercase`}>{label}</span>
                            <p className="text-[9px] text-brown/70 leading-snug mt-0.5 truncate">{p.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>,
          ]}
        </div>
      </div>

      {/* ── À DÉGUSTER CETTE SEMAINE ── */}
      {products.length > 0 && (
        <div className="bg-cream py-14">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <h2 className="text-[clamp(2rem,4vw,4.5rem)] font-bold uppercase tracking-tight text-black mb-8">
              À déguster cette semaine
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
