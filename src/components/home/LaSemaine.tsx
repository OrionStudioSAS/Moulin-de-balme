import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";
import SemaineProducts from "./SemaineProducts";

const DAYS = [
  { label: "Lundi",    hours: "de 7h30 à 18h", open: true  },
  { label: "Mardi",   hours: "de 7h30 à 18h", open: true  },
  { label: "Mercredi",hours: "de 7h30 à 18h", open: true  },
  { label: "Jeudi",   hours: "de 7h30 à 18h", open: true  },
  { label: "Vendredi",hours: "de 7h30 à 18h", open: true  },
  { label: "Samedi",  hours: "de 7h30 à 18h", open: true  },
  { label: "Dimanche",hours: "Fermé",          open: false },
];

export default async function LaSemaine() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_available", true)
    .eq("is_semaine", true)
    .order("sort_order");

  const items = (products ?? []) as Product[];
  const total = items.length;

  return (
    <section id="la-semaine" className="bg-[#4B3A33]">
      <div className="grid grid-cols-1 md:grid-cols-2 md:h-[680px]">

        {/* Gauche — titre + horaires */}
        <div className="px-8 md:px-14 py-14 flex flex-col gap-8">
          {/* Titre */}
          <div>
            <h2 className="text-[clamp(2.2rem,4vw,4.5rem)] font-bold text-white uppercase tracking-tight leading-none mb-3">
              Cette<br />semaine
            </h2>
            <p className="text-[clamp(1rem,2vw,1.5rem)] font-light text-white/80 tracking-wide mb-5">
              au Moulin de Balme
            </p>
            <p className="text-[11px] text-white/60 leading-relaxed max-w-sm">
              Au Fournil de Balme, chaque jour a sa propre carte. Les pains au levain, façonnés
              à la main, sont là toute la semaine — mais certains spéciaux ne sortent qu&apos;un jour
              précis. Une farine ancienne, une fournée de croissants venus d&apos;ailleurs, une tourte
              saisonnière. Voici ce qui sort du four cette semaine.
            </p>
          </div>

          {/* Compteur total — une seule fois */}
          {total > 0 && (
            <div>
              <span className="bg-[#FEF2E4] text-brown text-[9px] font-bold tracking-widest uppercase px-3 py-1.5">
                {total} produit{total > 1 ? "s" : ""} cette semaine
              </span>
            </div>
          )}

          {/* Jours */}
          <div className="divide-y divide-white/10">
            {DAYS.map((day) => (
              <div key={day.label} className="flex items-center justify-between py-3.5">
                <span className={`text-base font-bold uppercase tracking-widest ${day.open ? "text-white" : "text-white/40"}`}>
                  {day.label}
                </span>
                <span className={`text-xs tracking-wider ${day.open ? "text-white/60" : "text-white/30"}`}>
                  {day.hours}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Droite — produits scrollables */}
        <div className="relative bg-cream overflow-hidden h-full">
          {items.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-brown/30 tracking-wider italic">
                Aucun produit cette semaine
              </p>
            </div>
          ) : (
            <SemaineProducts products={items} />
          )}
        </div>

      </div>
    </section>
  );
}
