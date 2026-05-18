import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import type { Product, Category } from "@/types";

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;
  const supabase = await createClient();

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("is_available", true)
      .order("sort_order"),
  ]);

  const filtered = categorie
    ? (products ?? []).filter((p: Product) => p.category?.slug === categorie)
    : (products ?? []);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-brown py-20 px-4 md:px-8 text-center">
        <p className="label-tag text-cream/60 mb-3">Artisanat</p>
        <h1 className="section-title text-cream">Nos Produits</h1>
        <p className="text-xs text-cream/60 mt-3 tracking-wider">
          Façonnés à la main, cuits au four à bois
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Category filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          <a
            href="/produits"
            className={`text-xs tracking-widest uppercase px-4 py-2 border transition-colors ${
              !categorie
                ? "border-brown bg-brown text-cream"
                : "border-brown/30 text-brown/60 hover:border-brown hover:text-brown"
            }`}
          >
            Tous
          </a>
          {(categories ?? []).map((cat: Category) => (
            <a
              key={cat.slug}
              href={`/produits?categorie=${cat.slug}`}
              className={`text-xs tracking-widest uppercase px-4 py-2 border transition-colors ${
                categorie === cat.slug
                  ? "border-brown bg-brown text-cream"
                  : "border-brown/30 text-brown/60 hover:border-brown hover:text-brown"
              }`}
            >
              {cat.name}
            </a>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="text-sm text-warm-gray text-center py-20 tracking-wider">
            Aucun produit disponible pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
