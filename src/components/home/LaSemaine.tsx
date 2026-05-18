import Link from "next/link";

const SCHEDULE = [
  { day: "Lundi", hours: "7h à 19h", note: "Fermeture le lundi?" },
  { day: "Mardi", hours: "7h à 19h", note: null },
  { day: "Mercredi", hours: "7h à 19h", note: null },
  { day: "Jeudi", hours: "7h à 19h", note: null },
  { day: "Vendredi", hours: "7h à 19h", note: null },
  { day: "Samedi", hours: "7h à 19h", note: null },
  { day: "Dimanche", hours: "Fermé", note: null },
];

const WEEKLY_PRODUCTS = [
  { day: "Lundi", label: "Miche polaire", tag: "COUP DE CŒUR", image: null },
  { day: "Mercredi", label: "Pain brioché", tag: "EXCLUSIF DU FOUR", image: null },
  { day: "Vendredi", label: "Kouig-amann", tag: "SORTIE DU FOUR", image: null },
];

export default function LaSemaine() {
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

          {/* Weekly specials */}
          <div className="flex flex-col gap-4">
            {WEEKLY_PRODUCTS.map((p) => (
              <div key={p.day} className="flex gap-4">
                <div className="w-24 h-24 flex-shrink-0 bg-cream/10" />
                <div className="flex flex-col justify-center">
                  <p className="text-xs text-gold tracking-widest uppercase mb-1">{p.day}</p>
                  <p className="text-sm font-medium tracking-wider">{p.label}</p>
                  <p className="text-xs text-cream/50 tracking-wider mt-1">{p.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
