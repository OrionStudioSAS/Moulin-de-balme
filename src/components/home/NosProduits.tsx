import Link from "next/link";

const CATEGORIES = [
  { label: "Pain", slug: "pains", color: "bg-brown/10" },
  { label: "Biscuits", slug: "biscuits", color: "bg-gold/10" },
  { label: "Tresses (Insta-mode)", slug: "tresses", color: "bg-brown/5" },
  { label: "Croissant", slug: "viennoiseries", color: "bg-cream-dark" },
  { label: "Beurre", slug: "viennoiseries", color: "bg-gold/20" },
  { label: "Biscuits", slug: "biscuits", color: "bg-brown/15" },
];

export default function NosProduits() {
  return (
    <section className="py-20 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left: title */}
          <div className="md:sticky md:top-24">
            <p className="label-tag mb-4">Nos produits</p>
            <h2 className="section-title mb-4">
              Polaris-Mouret le cuite&amp; l'artisan dans son moulin
            </h2>
            <Link href="/produits" className="btn-outline inline-block mt-6">
              Voir tous les produits
            </Link>
          </div>

          {/* Right: product grid */}
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={i}
                href={`/produits?categorie=${cat.slug}`}
                className={`group aspect-square ${cat.color} flex items-end p-4 hover:opacity-90 transition-opacity`}
              >
                <span className="text-sm font-medium tracking-wider text-brown">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
