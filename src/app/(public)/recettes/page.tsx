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
          <Link href={`/recettes/${featured.slug}`} className="group block">
            {/* Zone image — fond crème clair, image centrée */}
            <div className="relative bg-cream-dark flex items-end justify-center overflow-hidden min-h-[300px] px-8 pt-8">
              {featured.tags.length > 0 && (
                <div className="absolute top-5 left-6 flex gap-2 flex-wrap z-10">
                  {featured.tags.slice(0, 2).map((t) => (
                    <span key={t} className="bg-[#4A7C59] text-white text-[8px] font-bold tracking-widest uppercase px-2 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {featured.image_url ? (
                <Image
                  src={featured.image_url}
                  alt={featured.title}
                  width={400}
                  height={300}
                  className="object-contain relative z-10 group-hover:scale-105 transition-transform duration-700"
                  style={{ maxHeight: "300px" }}
                />
              ) : (
                <div className="w-full h-[300px]" />
              )}
            </div>
            {/* Zone texte — fond brun */}
            <div className="bg-brown px-6 md:px-10 py-8 flex flex-col md:flex-row md:items-end gap-6 justify-between">
              <div className="flex flex-col gap-3">
                <h2 className="text-[clamp(1.4rem,3vw,2.6rem)] font-bold text-cream uppercase tracking-tight leading-tight">
                  {featured.title}
                </h2>
                <div className="flex items-center gap-4 text-[9px] text-cream/40 tracking-widest uppercase">
                  {featured.total_time && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cream/40 inline-block" />
                      {featured.total_time}
                    </span>
                  )}
                  {featured.published_at && (
                    <span>
                      {new Date(featured.published_at).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>
              <span className="shrink-0 text-[10px] font-bold tracking-widest uppercase text-cream border border-cream/40 px-5 py-3 group-hover:bg-cream group-hover:text-brown transition-colors">
                Découvrir la recette →
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* ── GRILLE RECETTES ── */}
      {rest.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rest.map((recipe) => (
              <RecetteCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}

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
    <div className="group bg-brown flex flex-col">
      <Link href={`/recettes/${recipe.slug}`} className="block">
        <div className="aspect-square bg-brown-dark overflow-hidden relative">
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
        <div className="p-4 pb-0">
          <p className="text-xs font-bold tracking-wider text-cream mb-1 uppercase leading-snug">
            {recipe.title}
          </p>
          {recipe.total_time && (
            <p className="text-xs text-cream/70 tracking-wider mb-3">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cream/60 mr-1.5 align-middle" />
              {recipe.total_time}
            </p>
          )}
        </div>
      </Link>
      <div className="p-4 pt-1 mt-auto">
        <Link
          href={`/recettes/${recipe.slug}`}
          className="block w-full text-center border border-cream text-cream text-[11px] tracking-widest uppercase py-2.5 hover:bg-cream hover:text-brown transition-colors"
        >
          Découvrir la recette
        </Link>
      </div>
    </div>
  );
}
