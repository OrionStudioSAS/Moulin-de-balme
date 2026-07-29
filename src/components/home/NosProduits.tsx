import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types";

export default async function NosProduits() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")
    .limit(6);

  return (
    <section className="bg-cream">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* Colonne gauche — titre sticky */}
          <div className="md:sticky md:top-24">
            <h2 className="text-[clamp(2.2rem,4vw,4.5rem)] font-bold uppercase tracking-tight leading-none text-brown mb-6">
              Nos<br />produits
            </h2>
            <p className="text-sm font-medium tracking-[0.15em] uppercase text-brown mb-8">
              Chaque pièce est façonnée à la main, levée plusieurs heures, cuite sur sole. Rien de plus. La farine, l&apos;eau, le sel, le levain et le temps.
            </p>
            <Link
              href="/produits"
              className="inline-flex items-center border border-brown text-brown text-[10px] font-bold tracking-widest uppercase px-6 py-3 hover:bg-brown hover:text-cream transition-colors"
            >
              Voir tous les produits
            </Link>
          </div>

          {/* Colonne droite — grille 2×3 */}
          <div className="grid grid-cols-2 gap-3">
            {(categories ?? []).slice(0, 6).map((cat: Category) => (
              <Link
                key={cat.slug}
                href={`/produits?categorie=${cat.slug}`}
                className="group relative overflow-hidden aspect-[3/4] bg-brown/20"
              >
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brown/30 to-brown/60" />
                )}
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />
                <span className="absolute bottom-5 left-5 text-white text-xl font-light tracking-wider capitalize">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
