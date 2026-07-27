import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

const DAYS = [
  { key: "lundi",    label: "Lundi",    hours: "de 7h30 à 18h" },
  { key: "mardi",    label: "Mardi",    hours: "de 7h30 à 18h" },
  { key: "mercredi", label: "Mercredi", hours: "de 7h30 à 18h" },
  { key: "jeudi",    label: "Jeudi",    hours: "de 7h30 à 18h" },
  { key: "vendredi", label: "Vendredi", hours: "de 7h30 à 18h" },
  { key: "samedi",   label: "Samedi",   hours: "de 7h30 à 18h" },
];

export default async function LaSemaine() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, available_days")
    .eq("is_available", true);

  // Compter les produits disponibles par jour
  const countByDay: Record<string, number> = {};
  (products ?? []).forEach((p: Pick<Product, "id" | "available_days">) => {
    (p.available_days ?? []).forEach((d: string) => {
      countByDay[d] = (countByDay[d] ?? 0) + 1;
    });
  });

  return (
    <section id="la-semaine" className="bg-[#4B3A33]">
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* Gauche — titre + liste des jours */}
        <div className="px-8 md:px-14 py-16 flex flex-col justify-between">
          <div>
            <h2 className="text-[clamp(2.2rem,4vw,4.5rem)] font-bold text-white uppercase tracking-tight leading-none mb-2">
              Cette<br />semaine
            </h2>
            <p className="text-[clamp(1.2rem,2.5vw,2.2rem)] font-light text-white tracking-wider mb-8">
              au Moulin de Balme
            </p>
            <p className="text-[11px] text-white leading-relaxed max-w-sm mb-10">
              Au Fournil de Balme, chaque jour a sa propre carte. Les pains au levain, façonnés
              à la main, sont là toute la semaine — mais certains spéciaux ne sortent qu&apos;un jour
              précis. Voici ce qui sort du four cette semaine.
            </p>
          </div>

          {/* Liste des jours */}
          <div className="divide-y divide-white/10">
            {DAYS.map((day) => {
              const count = countByDay[day.key] ?? 0;
              return (
                <div key={day.key} className="flex items-center justify-between py-4 bg-[#FFF7EF]/5 hover:bg-[#FFF7EF]/10 transition-colors px-2">
                  <div className="flex items-center gap-4">
                    <span className="text-white text-sm font-medium tracking-wider w-24">
                      {day.label}
                    </span>
                    {count > 0 && (
                      <span className="bg-[#FEF2E4] text-brown text-[9px] font-bold tracking-widest uppercase px-2 py-1">
                        {count} produit{count > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <span className="text-white text-xs tracking-wider">{day.hours}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Droite — image pleine hauteur */}
        <div className="relative min-h-[400px] md:min-h-0 bg-brown/30">
          <Image
            src="/images/semaine-photo.jpg"
            alt="Au fournil du Moulin de Balme"
            fill
            className="object-cover"
          />
        </div>

      </div>
    </section>
  );
}
