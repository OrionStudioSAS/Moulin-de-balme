"use client";

const PRESS = [
  {
    outlet: "La Montagne",
    quote:
      "« De Tokyo à Brive… l'étonnant parcours de Stéphane Reinat, nouvel artisan derrière le Fournil de Balme »",
  },
  {
    outlet: "Brive Magazine",
    quote:
      "« Stéphane Reinat et son épouse Tomoko ont repris la boulangerie. Des pains cuits au levain qui font déjà parler d'eux »",
  },
  {
    outlet: "La Dépêche",
    quote:
      "« Après le Japon et la Chine, ce boulanger s'installe dans le Lot et participe à la meilleure boulangerie de France »",
  },
];

const IG_PLACEHOLDERS = Array.from({ length: 6 });

export default function InstagramSection() {
  return (
    <section className="bg-cream">
      {/* Instagram grid */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-16 pb-10">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-[clamp(2.2rem,4vw,4.5rem)] font-bold uppercase tracking-tight text-brown leading-none">
            Instagram
          </h2>
          <a
            href="https://instagram.com/moulindebalme"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold tracking-widest uppercase text-brown border-b border-brown pb-0.5 hover:opacity-60 transition-opacity"
          >
            @moulindebalme
          </a>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {IG_PLACEHOLDERS.map((_, i) => (
            <a
              key={i}
              href="https://instagram.com/moulindebalme"
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square bg-brown/10 hover:bg-brown/20 transition-colors block"
            />
          ))}
        </div>
      </div>

      {/* Press quotes */}
      <div className="border-t border-brown/10 py-12 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {PRESS.map((p) => (
            <div key={p.outlet}>
              <p className="text-xs font-bold tracking-widest uppercase text-brown mb-3">
                {p.outlet}
              </p>
              <p className="text-xs text-brown/50 leading-relaxed italic">
                {p.quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
