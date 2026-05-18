export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Info */}
          <div>
            <p className="label-tag mb-4">Nous contacter</p>
            <h2 className="section-title mb-8">La Montagne</h2>

            <div className="space-y-6 text-sm text-warm-gray">
              <div>
                <p className="text-xs tracking-widest uppercase text-brown mb-1">Adresse</p>
                <p>12 Rue de la Boulangerie</p>
                <p>74120 Megève, France</p>
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-brown mb-1">Téléphone</p>
                <a href="tel:+33450000000" className="hover:text-brown transition-colors">
                  +33 (0)4 50 00 00 00
                </a>
              </div>
              <div>
                <p className="text-xs tracking-widests uppercase text-brown mb-1">Email</p>
                <a href="mailto:contact@moulindebalme.fr" className="hover:text-brown transition-colors">
                  contact@moulindebalme.fr
                </a>
              </div>
              <div>
                <p className="text-xs tracking-widests uppercase text-brown mb-2">Horaires</p>
                <div className="space-y-1">
                  {["Lundi — Vendredi : 7h → 19h", "Samedi : 7h → 19h", "Dimanche : Fermé"].map((h) => (
                    <p key={h} className="text-xs tracking-wider">{h}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="aspect-square bg-warm-gray/20 flex items-center justify-center">
            <p className="text-xs text-warm-gray tracking-wider">Carte Google Maps</p>
          </div>
        </div>
      </div>
    </section>
  );
}
