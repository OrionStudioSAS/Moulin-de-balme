import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

const SCHEDULE = [
  { day: "Lundi", hours: "7h à 19h" },
  { day: "Mardi", hours: "7h à 19h" },
  { day: "Mercredi", hours: "7h à 19h" },
  { day: "Jeudi", hours: "7h à 19h" },
  { day: "Vendredi", hours: "7h à 19h" },
  { day: "Samedi", hours: "7h à 19h" },
  { day: "Dimanche", hours: "Fermé" },
];

const DAY_MAP: Record<string, string> = {
  lundi: "Lundi", mardi: "Mardi", mercredi: "Mercredi",
  jeudi: "Jeudi", vendredi: "Vendredi", samedi: "Samedi",
};

export default async function LaSemaine() {
  const supabase = await createClient();

  // Produits spéciaux : disponibles seulement certains jours (pas tous)
  const { data: specials } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_available", true)
    .eq("is_featured", true)
    .order("sort_order")
    .limit(4);

  // Filtrer ceux qui ne sont pas dispo tous les jours
  const weekly = (specials ?? []).filter(
    (p: Product) => p.available_days.length > 0 && p.available_days.length < 7
  ).slice(0, 3);

  return (
    <section id="la-semaine" className="py-20 bg-brown text-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Schedule */}
          <div>
            <p className="label-tag text-cream/60 mb-4">La semaine</p>
            <h2 className="section-title text-cream mb-8">
              au Moulin de Balme
            </h2>

            <div className="space-y-0">
              {SCHEDULE.map((s) => (
                <div
                  key={s.day}
                  className="flex justify-between items-center py-4 border-b border-cream/10"
                >
                  <span className="text-sm tracking-widest uppercase text-cream/80">
                    {s.day}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-cream/50 tracking-wider">
                      {s.hours}
                    </span>
                    {s.hours !== "Fermé" && (
                      <Link
                        href="/click-and-collect"
                        className="text-xs tracking-widest uppercase border border-cream/30 px-3 py-1 hover:border-gold hover:text-gold transition-colors"
                      >
                        Réserver
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly specials from DB */}
          <div className="flex flex-col gap-6 justify-center">
            {weekly.map((p: Product) => {
              const days = p.available_days
                .map((d: string) => DAY_MAP[d] ?? d)
                .join(", ");
              return (
                <Link key={p.id} href={`/produits/${p.slug}`} className="flex gap-4 group">
                  <div className="w-24 h-24 flex-shrink-0 bg-cream/10 group-hover:bg-cream/15 transition-colors" />
                  <div className="flex flex-col justify-center">
                    <p className="text-xs text-gold tracking-widest uppercase mb-1">{days}</p>
                    <p className="text-sm font-medium tracking-wider group-hover:text-gold transition-colors">
                      {p.name}
                    </p>
                    <p className="text-xs text-cream/50 tracking-wider mt-1 uppercase">
                      {p.category?.name}
                    </p>
                    <p className="text-xs font-bold text-cream/80 mt-1">
                      {p.price.toFixed(2)} €
                    </p>
                  </div>
                </Link>
              );
            })}

            {weekly.length === 0 && (
              <p className="text-xs text-cream/40 tracking-wider">
                Retrouvez nos spécialités selon les jours de la semaine.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
