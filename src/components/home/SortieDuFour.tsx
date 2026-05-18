import Link from "next/link";
import Image from "next/image";

const FEATURED = [
  { label: "Polaris — Miche", tag: "EXCLUSIF DU FOUR", slug: "polaris-miche", image: "/images/products/miche.jpg" },
  { label: "Concorde — Tarte", tag: "EXCLUSIF DU FOUR", slug: "concorde-tarte", image: "/images/products/concorde.jpg" },
  { label: "Crème brûlée — Tarte", tag: "EXCLUSIF DU FOUR", slug: "creme-brulee-tarte", image: "/images/products/creme-brulee.jpg" },
  { label: "Kouig brioche", tag: "EXCLUSIF DU FOUR", slug: "kouig-brioche", image: "/images/products/kouig.jpg" },
];

export default function SortieDuFour() {
  return (
    <section className="py-16 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <p className="label-tag mb-2">Sortie du four</p>
            <h2 className="section-title">
              Chaque pièce est façonnée à la main
            </h2>
            <p className="text-xs text-warm-gray mt-2 tracking-wider max-w-md">
              avec du beurre de qualité, du sel, du levain et du temps
            </p>
          </div>
          <p className="text-xs text-warm-gray tracking-widest uppercase">
            Voir plus
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURED.map((item) => (
            <Link
              key={item.slug}
              href={`/produits/${item.slug}`}
              className="group"
            >
              <div className="aspect-square bg-cream-dark overflow-hidden mb-3 relative">
                <div className="absolute inset-0 bg-brown/5 group-hover:bg-brown/10 transition-colors z-10" />
                {/* Placeholder until real images */}
                <div className="w-full h-full bg-gradient-to-br from-brown/10 to-gold/20 flex items-end p-3">
                  <span className="text-xs text-warm-gray tracking-wider">{item.tag}</span>
                </div>
              </div>
              <p className="text-sm font-medium tracking-wider text-brown mb-1">{item.label}</p>
              <p className="label-tag">{item.tag}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
