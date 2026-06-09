import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

const FARINE_COLORS = [
  "bg-[#E8D5B0]",
  "bg-[#C4A882]",
  "bg-[#D4B896]",
  "bg-[#6B4A35]",
];

export default async function NosFarines() {
  const supabase = await createClient();

  // Récupérer d'abord l'id de la catégorie farines
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
    : { data: [] };

  return (
    <section id="nos-farines" className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-4">
          <div>
            <p className="label-tag mb-2">Nos farines</p>
            <h2 className="section-title">Des farines sélectionnées</h2>
          </div>
          <Link href="/produits?categorie=farines" className="btn-outline self-start">
            Voir plus
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(farines ?? []).map((farine: Product, i: number) => (
            <Link key={farine.id} href={`/produits/${farine.slug}`} className="group">
              <div
                className={`aspect-[2/3] ${FARINE_COLORS[i % FARINE_COLORS.length]} mb-3 flex flex-col justify-end p-4 hover:opacity-90 transition-opacity`}
              >
                <p className="text-xs text-cream/90 tracking-wider leading-tight font-medium uppercase">
                  {farine.name}
                </p>
              </div>
              <p className="text-xs font-medium tracking-wider text-brown">{farine.name}</p>
              <p className="label-tag mt-1">{farine.price.toFixed(2)} €</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
