"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORY_LABELS: Record<string, string> = {
  pains:        "Tous les pains",
  viennoiseries:"Viennoiseries",
  patisseries:  "Pâtisseries",
  confitures:   "Confitures",
  farines:      "Farines",
};

export default function RecettesFilters({
  categories,
  active,
}: {
  categories: string[];
  active: string;
}) {
  const router = useRouter();
  const sp     = useSearchParams();

  const go = (cat: string) => {
    const params = new URLSearchParams(sp.toString());
    if (cat === "tous") params.delete("category");
    else params.set("category", cat);
    router.push(`/recettes?${params.toString()}`);
  };

  const all = ["tous", ...categories];

  return (
    <div className="border-b border-brown/10 bg-cream sticky top-16 z-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center gap-0 overflow-x-auto scrollbar-none">
        {all.map((cat) => {
          const isActive = cat === active;
          const label = cat === "tous" ? "Tous les pains" : (CATEGORY_LABELS[cat] ?? cat);
          return (
            <button
              key={cat}
              onClick={() => go(cat)}
              className={`shrink-0 text-[10px] font-bold tracking-widest uppercase px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? "border-brown text-brown"
                  : "border-transparent text-brown/40 hover:text-brown"
              }`}
            >
              {label}
            </button>
          );
        })}
        <div className="ml-auto shrink-0 pl-6 border-l border-brown/10">
          <button className="text-[10px] font-bold tracking-widest uppercase text-brown/40 hover:text-brown transition-colors flex items-center gap-1 py-3">
            Filtres
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 3h6M3 5h4M4 7h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
