import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Product, Category } from "@/types";

const CATEGORY_DESCRIPTIONS: Record<string, { title: string; subtitle: string; description: string }> = {
  pains: {
    title: "Les Pains",
    subtitle: "Des pains savoureux, nourrissants et bons pour la santé.",
    description:
      "Des farines moulues sur meule, du sel de Guérande, de l'eau et du levain-maison naturel sont les seuls et uniques ingrédients qui composent nos pains. Aucun conservateur, aucun additif.",
  },
  viennoiseries: {
    title: "Les Viennoiseries",
    subtitle: "Feuilletées à la main, au beurre AOP.",
    description:
      "Beurre AOP Charentes-Poitou, farine T65 Label Rouge, feuilletage 27 couches. Chaque viennoiserie est façonnée à la main et cuite le matin même.",
  },
  patisseries: {
    title: "Les Pâtisseries",
    subtitle: "Des créations artisanales de saison.",
    description:
      "Nos pâtisseries changent selon les saisons et les envies de Stéphane et Yumiko. Disponibles en quantités limitées.",
  },
  biscuits: {
    title: "Les Biscuits",
    subtitle: "Croustillants, généreux, sans artifice.",
    description:
      "Beurre demi-sel, sucre non raffiné, farine de qualité. Nos biscuits se conservent plusieurs semaines et voyagent très bien.",
  },
  farines: {
    title: "Nos Farines",
    subtitle: "Sélectionnées auprès de moulins partenaires.",
    description:
      "Nous travaillons exclusivement avec des moulins artisanaux qui pratiquent la mouture sur meule de pierre. Des farines vivantes, riches en nutriments.",
  },
};

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

  const currentCat = categorie
    ? (categories ?? []).find((c: Category) => c.slug === categorie)
    : null;

  const heroContent = categorie && CATEGORY_DESCRIPTIONS[categorie]
    ? CATEGORY_DESCRIPTIONS[categorie]
    : { title: "Nos Produits", subtitle: "Façonnés à la main, cuits au four.", description: "Pain au levain, viennoiseries, pâtisseries et biscuits. Chaque pièce est unique." };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero full-width */}
      <div className="relative bg-brown overflow-hidden min-h-[320px] flex items-end">
        <div className="absolute inset-0 bg-brown/70" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 pb-12 pt-20 w-full">
          <h1 className="text-6xl md:text-8xl font-bold tracking-widests uppercase text-cream leading-none mb-3">
            {heroContent.title}
          </h1>
          <p className="text-sm text-cream/70 tracking-wider uppercase mb-3">
            {heroContent.subtitle}
          </p>
          <p className="text-xs text-cream/50 leading-relaxed max-w-xl">
            {heroContent.description}
          </p>
        </div>
      </div>

      {/* Category filter bar */}
      <div className="border-b border-brown/10 bg-cream sticky top-[112px] z-30">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            <Link
              href="/produits"
              className={`shrink-0 text-[11px] tracking-widests uppercase px-5 py-4 border-b-2 transition-colors whitespace-nowrap ${
                !categorie
                  ? "border-brown text-brown font-bold"
                  : "border-transparent text-brown/50 hover:text-brown"
              }`}
            >
              Tous les produits
            </Link>
            {(categories ?? []).map((cat: Category) => (
              <Link
                key={cat.slug}
                href={`/produits?categorie=${cat.slug}`}
                className={`shrink-0 text-[11px] tracking-widests uppercase px-5 py-4 border-b-2 transition-colors whitespace-nowrap ${
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

      {/* Product grid */}
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
                {/* Recette du moment card — après le 6e produit */}
                {i === 5 && (
                  <div key="recette" className="col-span-2 bg-brown text-cream flex flex-col justify-end p-8 min-h-[300px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-brown via-brown/80 to-brown/20" />
                    <div className="relative z-10">
                      <p className="label-tag text-cream/50 mb-2">En ce moment</p>
                      <h3 className="text-3xl font-bold tracking-widests uppercase mb-4">
                        Recette du moment
                      </h3>
                      <Link
                        href="/produits"
                        className="inline-block border border-cream/40 text-cream text-[11px] tracking-widests uppercase px-5 py-2 hover:border-gold hover:text-gold transition-colors"
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
