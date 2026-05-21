import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types";

export default async function NosProduits() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <section className="py-20 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left: title */}
          <div className="md:sticky md:top-24">
            <p className="label-tag mb-4">Nos produits</p>
            <h2 className="section-title mb-4">
              Façonnés à la main,<br />cuits au four
            </h2>
            <p className="text-sm text-warm-gray leading-relaxed mt-3 max-w-sm">
              Polaris-Mouret le cuite &amp; l'artisan dans son moulin boulanger.
            </p>
            <Link href="/produits" className="btn-outline inline-block mt-6">
              Voir tous les produits
            </Link>
          </div>

          {/* Right: categories grid */}
          <div className="grid grid-cols-2 gap-4">
            {(categories ?? []).map((cat: Category, i: number) => {
              const colors = [
                "bg-brown/10",
                "bg-gold/15",
                "bg-brown/5",
                "bg-cream",
                "bg-gold/25",
              ];
              return (
                <Link
                  key={cat.slug}
                  href={`/produits?categorie=${cat.slug}`}
                  className={`group aspect-square ${colors[i % colors.length]} flex items-end p-5 hover:opacity-90 transition-opacity`}
                >
                  <span className="text-sm font-medium tracking-wider text-brown group-hover:underline">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
