import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Recipe } from "@/types";
import RecettesFilters from "@/components/recettes/RecettesFilters";

export default async function RecettesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("recipes")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (category && category !== "tous") {
    query = query.eq("category", category);
  }

  const { data } = await query;
  const recipes = (data ?? []) as Recipe[];

  // Toutes catégories pour le filtre
  const { data: allRaw } = await supabase
    .from("recipes")
    .select("category")
    .eq("is_published", true);
  const allCategories = Array.from(new Set((allRaw ?? []).map((r) => r.category as string))).sort();

  const featured  = recipes[0] ?? null;
  const rest      = recipes.slice(1);

  return (
    <div className="bg-cream">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden mt-[-64px] h-[465px]">
        <div className="absolute inset-0">
          <Image
            src="/images/recettes-hero.jpg"
            alt="Recettes & Histoires de pain"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-end max-w-[1400px] mx-auto px-6 md:px-12 pb-16 pt-40">
          <h1 className="text-[clamp(2.2rem,5vw,5.5rem)] font-bold text-white uppercase tracking-tight leading-none mb-4">
            Recettes &amp;<br />histoires de pain.
          </h1>
          <p className="text-sm font-medium tracking-[0.15em] uppercase text-white/60 mb-3">
            Le Moulin de Balme anciennement Le Fournil de Lisa
          </p>
          <p className="text-sm text-white/70 leading-relaxed max-w-lg">
            Des recettes transmises avec passion, chacune avec son histoire. Du canelé bordelais
            à la baguette d&apos;auteur — prenez le temps de faire.
          </p>
        </div>
      </section>

      {/* ── FILTRES CATÉGORIES ── */}
      <RecettesFilters categories={allCategories} active={category ?? "tous"} />

      {/* ── ARTICLE EN UNE ── */}
      {featured && (
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-10">
          <Link
            href={`/recettes/${featured.slug}`}
            className="group relative flex flex-col md:flex-row overflow-hidden bg-[#2A1F1A] min-h-[320px]"
          >
            {/* Image droite */}
            <div className="hidden md:block relative md:w-2/5 min-h-[320px]">
              {featured.image_url ? (
                <Image
                  src={featured.image_url}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-brown/40" />
              )}
            </div>
            {/* Texte gauche */}
            <div className="flex-1 flex flex-col justify-center p-10 md:p-14 gap-4">
              <div className="flex gap-2 flex-wrap">
                {featured.tags.slice(0, 2).map((t) => (
                  <span key={t} className="bg-[#4A7C59] text-white text-[8px] font-bold tracking-widest uppercase px-2 py-1">
                    {t}
                  </span>
                ))}
              </div>
              <h2 className="text-[clamp(1.4rem,3vw,2.8rem)] font-bold text-white uppercase tracking-tight leading-tight">
                {featured.title}
              </h2>
              <div className="flex gap-4 text-[9px] text-white/40 tracking-widest uppercase">
                {featured.total_time && <span>{featured.total_time}</span>}
                {featured.published_at && (
                  <span>
                    {new Date(featured.published_at).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </span>
                )}
              </div>
              <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-cream border border-cream/30 px-4 py-2 w-fit group-hover:bg-cream group-hover:text-brown transition-colors">
                Découvrir la recette →
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* ── GRILLE RECETTES ── */}
      {rest.length > 1 && (
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 pb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rest.slice(0, -1).map((recipe) => (
              <RecetteCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}

      {/* ── RECETTE DU MOMENT (dernier article, pleine largeur) ── */}
      {rest.length > 0 && (() => {
        const last = rest[rest.length - 1];
        return (
          <section className="max-w-[1400px] mx-auto px-6 md:px-12 pb-16">
            <Link href={`/recettes/${last.slug}`} className="group block">
              {/* Image pleine largeur */}
              <div className="relative w-full h-[420px] overflow-hidden bg-[#C4A882] mb-0">
                {last.image_url ? (
                  <Image
                    src={last.image_url}
                    alt={last.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#C4A882] to-[#6B4A35]" />
                )}
              </div>
              {/* Texte en dessous */}
              <div className="bg-brown px-8 py-8 md:px-12 md:py-10">
                <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-cream/40 mb-3">
                  Recette du moment
                </p>
                <h3 className="text-[clamp(1.6rem,3.5vw,3rem)] font-bold uppercase tracking-tight leading-tight text-cream mb-3">
                  {last.title}
                </h3>
                {last.description && (
                  <p className="text-xs text-cream/60 leading-relaxed max-w-2xl mb-6">
                    {last.description}
                  </p>
                )}
                <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-cream border border-cream/30 px-5 py-2.5 group-hover:bg-cream group-hover:text-brown transition-colors">
                  Découvrir la recette →
                </span>
              </div>
            </Link>
          </section>
        );
      })()}

      {/* ── CITATION ── */}
      <section className="bg-[#2A1F1A] py-16 px-6">
        <div className="max-w-[900px] mx-auto text-center">
          <blockquote className="text-[clamp(1.1rem,2.5vw,1.8rem)] font-light text-white/80 leading-relaxed italic">
            « Chaque recette est une invitation à ralentir.<br />
            Le bon pain ne se fait pas vite — et ça, c&apos;est une leçon de vie. »
          </blockquote>
          <p className="text-[10px] tracking-widest uppercase text-white/30 mt-6">
            — Stéphane Reinat, Maître Boulanger
          </p>
        </div>
      </section>

    </div>
  );
}

function RecetteCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="group">
      <Link href={`/recettes/${recipe.slug}`} className="block">
        <div className="aspect-square bg-cream-dark overflow-hidden mb-3 relative">
          {recipe.image_url ? (
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brown/5 to-gold/10" />
          )}
          {recipe.badge && (
            <div className="absolute top-2.5 left-2.5">
              <span className="bg-cream text-brown text-[8px] font-bold tracking-widest uppercase px-2 py-0.5">
                {recipe.badge}
              </span>
            </div>
          )}
        </div>
        <p className="text-xs font-medium tracking-wider text-brown mb-1 uppercase">
          {recipe.title}
        </p>
        {recipe.total_time && (
          <p className="text-xs text-warm-gray tracking-wider">{recipe.total_time}</p>
        )}
      </Link>
    </div>
  );
}
