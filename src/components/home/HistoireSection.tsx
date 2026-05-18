import Link from "next/link";

export default function HistoireSection() {
  return (
    <section id="histoire" className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-[4/5] bg-cream-dark overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-brown/10 to-brown/20" />
            {/* Photo boulangers placeholder */}
          </div>

          {/* Text */}
          <div className="max-w-lg">
            <p className="label-tag mb-4">Le Moulin®</p>
            <h2 className="section-title mb-6">
              De Tokyo à Megève — Le retour aux sources d'un globe-trotter
            </h2>
            <p className="text-sm text-warm-gray leading-relaxed mb-4">
              Stéphane Louvard a parcouru le monde avant de poser ses valises
              dans les Alpes. Formé à Tokyo, affiné à Paris, son regard sur la
              boulangerie est celui d'un artisan exigeant qui ne transige pas
              avec la qualité.
            </p>
            <p className="text-sm text-warm-gray leading-relaxed mb-4">
              Aux côtés de Yumiko, il façonne chaque jour des pièces uniques
              en sélectionnant les meilleures farines — issues de moulins
              partenaires, moulues sur pierre.
            </p>
            <p className="text-sm text-warm-gray leading-relaxed mb-8">
              Le Moulin de Balme, c'est l'histoire d'un retour aux sources,
              d'un savoir-faire transmis avec passion.
            </p>

            <div className="flex gap-4">
              <Link href="/collections" className="btn-outline">
                Découvrir les collections
              </Link>
              <Link href="/#contact" className="text-xs tracking-widest uppercase text-warm-gray hover:text-brown transition-colors self-center">
                Nous trouver →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
