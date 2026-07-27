import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

export default async function NosFarines() {
  const supabase = await createClient();

  const { data: cat } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", "farines")
    .single();

  const { data: farines } = cat
    ? await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("is_available", true)
        .eq("category_id", cat.id)
        .order("sort_order")
        .limit(6)
    : { data: [] };

  return (
    <section id="nos-farines" className="bg-cream py-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 items-start">

          {/* Colonne gauche étroite */}
          <div className="md:sticky md:top-24">
            <h2 className="text-[clamp(2.2rem,4vw,4.5rem)] font-bold uppercase tracking-tight leading-none text-brown mb-8">
              Nos<br />farines
            </h2>
            <Link
              href="/produits?categorie=farines"
              className="inline-flex items-center border border-brown text-brown text-[10px] font-bold tracking-widest uppercase px-5 py-2.5 hover:bg-brown hover:text-cream transition-colors"
            >
              Voir tout
            </Link>
          </div>

          {/* Grille 3×2 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(farines ?? []).map((farine: Product) => (
              <Link
                key={farine.id}
                href={`/produits/${farine.slug}`}
                className="group relative overflow-hidden aspect-[3/4] bg-brown/20"
              >
                {farine.image_url ? (
                  <Image
                    src={farine.image_url}
                    alt={farine.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#C4A882] to-[#6B4A35]" />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <span className="absolute bottom-5 left-5 text-white text-base font-light tracking-wider leading-snug max-w-[80%]">
                  {farine.name}
                </span>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
