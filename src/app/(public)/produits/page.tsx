import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import type { Product, Category, Subcategory } from "@/types";

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; sous?: string }>;
}) {
  const { categorie, sous } = await searchParams;
  const supabase = await createClient();

  const [
    { data: categories },
    { data: subcategories },
    { data: products },
    { data: settings },
  ] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order").lte("sort_order", 6),
    categorie
      ? supabase
          .from("subcategories")
          .select("*")
          .order("sort_order")
          .then(async ({ data }) => {
            // filter client-side after we have the category id
            return { data };
          })
      : Promise.resolve({ data: [] }),
    supabase
      .from("products")
      .select("*, category:categories(*), subcategory:subcategories(*)")
      .eq("is_available", true)
      .order("sort_order"),
    supabase.from("site_settings").select("value").eq("key", "products_banner").single(),
  ]);

  const currentCat = categorie
    ? (categories ?? []).find((c: Category) => c.slug === categorie)
    : null;

  // Sous-catégories de la catégorie courante
  const currentSubs = currentCat
    ? (subcategories ?? []).filter((s: Subcategory) => s.category_id === currentCat.id)
    : [];

  // Filtrage produits
  let filtered = (products ?? []) as Product[];
  if (categorie) filtered = filtered.filter((p) => p.category?.slug === categorie);
  if (sous) filtered = filtered.filter((p) => p.subcategory?.slug === sous);

  // Bannière
  const defaultBanner = (settings?.value ?? {}) as {
    title?: string;
    subtitle?: string;
    description?: string;
    banner_image_url?: string | null;
  };

  const bannerTitle = currentCat?.banner_title || currentCat?.name || defaultBanner.title || "Nos Produits";
  const bannerSubtitle = currentCat?.banner_subtitle || defaultBanner.subtitle || "Façonnés à la main, cuits au four.";
  const bannerDescription = currentCat?.banner_description || defaultBanner.description || "";
  const bannerImage = currentCat?.banner_image_url || defaultBanner.banner_image_url || null;

  return (
    <div className="min-h-screen bg-cream">
      {/* Bannière dynamique */}
      <div className="relative overflow-hidden min-h-[320px] flex items-end bg-brown">
        {bannerImage && (
          <Image
            src={bannerImage}
            alt={bannerTitle}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 pb-12 pt-24 w-full">
          <h1 className="text-[clamp(2.2rem,4vw,4.5rem)] font-bold tracking-tight uppercase text-white leading-none mb-3">
            {bannerTitle}
          </h1>
          {bannerSubtitle && (
            <p className="text-sm text-white tracking-[0.15em] uppercase mb-2">
              {bannerSubtitle}
            </p>
          )}
          {bannerDescription && (
            <p className="text-xs text-white/70 leading-relaxed max-w-xl">
              {bannerDescription}
            </p>
          )}
        </div>
      </div>

      {/* Barre de filtre principale */}
      <div className="border-b border-brown/10 bg-cream sticky top-[64px] z-30">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            <Link
              href="/produits"
              className={`shrink-0 text-[11px] tracking-widest uppercase px-5 py-4 border-b-2 transition-colors whitespace-nowrap font-bold ${
                !categorie
                  ? "border-brown text-brown"
                  : "border-transparent text-brown/50 hover:text-brown font-normal"
              }`}
            >
              Tous les produits
            </Link>
            {(categories ?? []).map((cat: Category) => (
              <Link
                key={cat.slug}
                href={`/produits?categorie=${cat.slug}`}
                className={`shrink-0 text-[11px] tracking-widest uppercase px-5 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  categorie === cat.slug
                    ? "border-brown text-brown font-bold"
                    : "border-transparent text-brown/50 hover:text-brown"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Barre de filtre secondaire (sous-catégories) */}
      {currentSubs.length > 0 && (
        <div className="border-b border-brown/10 bg-cream/80 sticky top-[112px] z-20">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
              <Link
                href={`/produits?categorie=${categorie}`}
                className={`shrink-0 text-[10px] tracking-widest uppercase px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  !sous
                    ? "border-brown text-brown font-bold"
                    : "border-transparent text-brown/40 hover:text-brown"
                }`}
              >
                Tous
              </Link>
              {currentSubs.map((sub: Subcategory) => (
                <Link
                  key={sub.slug}
                  href={`/produits?categorie=${categorie}&sous=${sub.slug}`}
                  className={`shrink-0 text-[10px] tracking-widest uppercase px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    sous === sub.slug
                      ? "border-brown text-brown font-bold"
                      : "border-transparent text-brown/40 hover:text-brown"
                  }`}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grille produits */}
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        {filtered.length === 0 ? (
          <p className="text-sm text-warm-gray text-center py-20 tracking-wider">
            Aucun produit disponible pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {filtered.map((product: Product, i: number) => (
              <>
                <ProductCard key={product.id} product={product} showAddButton />
                {i === 5 && (
                  <div key="recette" className="col-span-2 bg-brown text-cream flex flex-col justify-end p-8 min-h-[300px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-brown via-brown/80 to-brown/20" />
                    <div className="relative z-10">
                      <p className="label-tag text-cream/50 mb-2">En ce moment</p>
                      <h3 className="text-3xl font-bold tracking-widest uppercase mb-4">
                        Recette du moment
                      </h3>
                      <Link
                        href="/produits"
                        className="inline-block border border-cream/40 text-cream text-[11px] tracking-widest uppercase px-5 py-2 hover:border-gold hover:text-gold transition-colors"
                      >
                        Découvrir
                      </Link>
                    </div>
                  </div>
                )}
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
