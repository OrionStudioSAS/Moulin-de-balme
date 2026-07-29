const H2 = "text-[clamp(2.2rem,4vw,4.5rem)] font-bold uppercase tracking-tight leading-none";

const ROWS = [
  { label: "Téléphone", value: "+33 5 55 00 00 00", href: "tel:+33555000000" },
  { label: "Email", value: "contact@moulin-de-balme.fr", href: "mailto:contact@moulin-de-balme.fr" },
  { label: "Adresse", value: "7 avenue Alsace-Lorraine, 19100 Brive-la-Gaillarde", href: null },
];

const MAP_Q = encodeURIComponent("7 avenue Alsace-Lorraine, Brive-la-Gaillarde, France");

export default function ContactSection() {
  return (
    <section id="contact" className="bg-brown">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* ─── Gauche : titre + contact rows ─── */}
          <div>
            <h2 className={`${H2} text-white mb-14`}>
              Nous<br />Contacter
            </h2>

            <div className="divide-y divide-white/10">
              {ROWS.map(({ label, value, href }) => (
                <div key={label} className="grid grid-cols-[140px_1fr] gap-4 py-6">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 pt-0.5">
                    {label}
                  </span>
                  {href ? (
                    <a
                      href={href}
                      className="text-sm text-white/80 hover:text-white transition-colors"
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="text-sm text-white/80">{value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ─── Droite : Google Maps ─── */}
          <div className="w-full aspect-[4/3] md:aspect-auto md:h-[420px]">
            <iframe
              src={`https://maps.google.com/maps?q=${MAP_Q}&z=15&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
