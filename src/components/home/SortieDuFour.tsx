import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

export default async function SortieDuFour() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_available", true)
    .eq("is_featured", true)
    .order("sort_order")
    .limit(4);

  const items = products ?? [];

  return (
    <section className="py-16 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <p className="label-tag mb-2">Sortie du four</p>
            <h2 className="section-title">
              Chaque pièce est façonnée à la main
            </h2>
            <p className="text-xs text-warm-gray mt-2 tracking-wider">
              avec du beurre de qualité, du sel, du levain et du temps
            </p>
          </div>
          <Link href="/produits" className="label-tag hover:text-brown transition-colors">
            Voir plus →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((product: Product) => (
            <Link key={product.id} href={`/produits/${product.slug}`} className="group">
              <div className="aspect-square bg-gradient-to-br from-brown/10 to-gold/20 overflow-hidden mb-3 relative flex items-end p-3 group-hover:opacity-90 transition-opacity">
                <span className="text-xs text-warm-gray tracking-wider uppercase">
                  Exclusif du four
                </span>
              </div>
              <p className="text-sm font-medium tracking-wider text-brown mb-1">
                {product.name}
              </p>
              <p className="label-tag">{product.category?.name}</p>
              <p className="text-sm font-bold text-brown mt-1">
                {product.price.toFixed(2)} €
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
