import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import type { Product, Category, Subcategory } from "@/types";
import { Fragment } from "react";

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
    supabase.from("categories").select("*").order("sort_order"),
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
  const isFlourCategory = categorie === "farines";

  return (
    <div className="min-h-screen bg-cream" data-products-variant={isFlourCategory ? "farines" : "default"}>
      {/* Bannière dynamique */}
      <div
        className={
          isFlourCategory
            ? "relative mt-[-64px] flex h-[390px] items-end overflow-hidden bg-brown md:h-[420px] lg:h-[465px]"
            : "relative overflow-hidden h-[465px] flex items-end bg-brown mt-[-64px]"
        }
        data-testid={isFlourCategory ? "farines-hero" : undefined}
      >
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
        <div
          className={
            isFlourCategory
              ? "relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-8 pt-24 md:px-6 md:pb-11 lg:px-[34px] lg:pb-14"
              : "relative z-10 max-w-[1400px] mx-auto px-6 pb-12 pt-24 w-full"
          }
        >
          <h1
            className={
              isFlourCategory
                ? "mb-4 max-w-[940px] text-[44px] font-bold uppercase leading-[0.95] tracking-[0.016em] text-white md:text-[56px] lg:text-[80px]"
                : "text-[clamp(2.2rem,4vw,4.5rem)] font-bold tracking-tight uppercase text-white leading-none mb-3"
            }
          >
            {bannerTitle}
          </h1>
          {bannerSubtitle && (
            <p
              className={
                isFlourCategory
                  ? "mb-3 max-w-[940px] text-xs font-bold uppercase leading-relaxed tracking-[0.15em] text-white md:text-sm"
                  : "text-sm text-white tracking-[0.15em] uppercase mb-2"
              }
            >
              {bannerSubtitle}
            </p>
          )}
          {bannerDescription && (
            <p
              className={
                isFlourCategory
                  ? "max-w-[940px] text-xs leading-relaxed text-white/80 md:max-w-2xl md:text-sm"
                  : "text-xs text-white/70 leading-relaxed max-w-xl"
              }
            >
              {bannerDescription}
            </p>
          )}
        </div>
      </div>

      {/* Barre de filtre principale */}
      <nav
        className={
          isFlourCategory
            ? "sticky top-[64px] z-30 border-b border-brown/10 bg-cream"
            : "border-b border-brown/10 bg-cream sticky top-[64px] z-30"
        }
        aria-label="Catégories de produits"
        data-testid={isFlourCategory ? "farines-category-nav" : undefined}
      >
        <div className={isFlourCategory ? "mx-auto max-w-[1440px] px-4 md:px-6 lg:px-[34px]" : "max-w-[1400px] mx-auto px-6"}>
          <div
            className={
              isFlourCategory
                ? "scrollbar-hide flex min-h-16 items-center gap-0 overflow-x-auto lg:min-h-[76px]"
                : "flex items-center gap-0 overflow-x-auto scrollbar-hide"
            }
          >
            <Link
              href="/produits"
              aria-current={!categorie ? "page" : undefined}
              className={`${isFlourCategory ? "inline-flex min-h-11 items-center px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-gold motion-reduce:transition-none lg:px-5" : "px-5 py-4"} shrink-0 text-[11px] tracking-widest uppercase border-b-2 transition-colors whitespace-nowrap font-bold ${
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
                aria-current={categorie === cat.slug ? "page" : undefined}
                className={`${isFlourCategory ? "inline-flex min-h-11 items-center px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-gold motion-reduce:transition-none lg:px-5" : "px-5 py-4"} shrink-0 text-[11px] tracking-widest uppercase border-b-2 transition-colors whitespace-nowrap ${
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
      </nav>

      {/* Barre de filtre secondaire (sous-catégories) */}
      {currentSubs.length > 0 && (
        <nav
          className="border-b border-brown/10 bg-cream/80 sticky top-[112px] z-20"
          aria-label={isFlourCategory ? "Sous-catégories de farines" : "Sous-catégories de produits"}
        >
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
              <Link
                href={`/produits?categorie=${categorie}`}
                aria-current={!sous ? "page" : undefined}
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
                  aria-current={sous === sub.slug ? "page" : undefined}
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
        </nav>
      )}

      {/* Grille produits */}
      <div
        className={
          isFlourCategory
            ? "mx-auto max-w-[1440px] px-4 py-8 md:px-6 md:py-10 lg:px-[34px]"
            : "max-w-[1400px] mx-auto px-6 py-10"
        }
      >
        {filtered.length === 0 ? (
          <p className="text-sm text-warm-gray text-center py-20 tracking-wider">
            Aucun produit disponible pour le moment.
          </p>
        ) : (
          <div
            className={
              isFlourCategory
                ? "grid grid-cols-1 gap-x-3 gap-y-6 min-[360px]:grid-cols-2 md:gap-x-6 md:gap-y-8 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10"
                : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10"
            }
            data-testid={isFlourCategory ? "farines-product-grid" : undefined}
          >
            {filtered.map((product: Product, i: number) => (
              <Fragment key={product.id}>
                <ProductCard
                  product={product}
                  showAddButton
                  variant={isFlourCategory ? "farines" : "default"}
                />
                {i === 5 && (
                  <div className={`${isFlourCategory ? "col-span-1 min-[360px]:col-span-2" : "col-span-2"} bg-brown text-cream flex flex-col justify-end p-8 min-h-[300px] relative overflow-hidden`}>
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
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
