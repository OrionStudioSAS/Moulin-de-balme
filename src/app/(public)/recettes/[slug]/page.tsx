import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Recipe } from "@/types";
import InstagramSection from "@/components/home/InstagramSection";

const CHIP_COLORS: Record<string, string> = {
  green:  "bg-[#4A7C59] text-white",
  blue:   "bg-[#4B6FA5] text-white",
  brown:  "bg-[#8B6535] text-white",
  red:    "bg-[#9B3737] text-white",
  cream:  "bg-cream text-brown border border-brown/30",
};

export default async function RecetteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase  = await createClient();

  const { data } = await supabase
    .from("recipes")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!data) notFound();
  const recipe = data as Recipe;

  // 4 dernières recettes (hors celle-ci)
  const { data: othersRaw } = await supabase
    .from("recipes")
    .select("*")
    .eq("is_published", true)
    .neq("id", recipe.id)
    .order("published_at", { ascending: false })
    .limit(4);
  const others = (othersRaw ?? []) as Recipe[];

  return (
    <div className="bg-cream">
      {/* ── HERO ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 mt-[-64px] min-h-[calc(100vh-37px)]">
        {/* Gauche — texte */}
        <div className="bg-[#2A1F1A] flex flex-col justify-center px-10 md:px-14 pt-28 pb-14 gap-6">
          <div className="flex gap-2 flex-wrap">
            {recipe.tags.map((t) => (
              <span key={t} className="bg-[#4A7C59] text-white text-[8px] font-bold tracking-widest uppercase px-2 py-1">
                {t}
              </span>
            ))}
          </div>
          <div>
            <h1 className="text-[clamp(2.2rem,4vw,4.5rem)] font-bold text-white uppercase tracking-tight leading-none mb-2">
              {recipe.title}
            </h1>
            {recipe.subtitle && (
              <p className="text-sm font-medium tracking-[0.15em] uppercase text-white/60">{recipe.subtitle}</p>
            )}
          </div>
          {recipe.description && (
            <p className="font-editorial font-light italic text-[1.05rem] text-white/80 leading-relaxed max-w-md">{recipe.description}</p>
          )}
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            {[
              { label: "Niveau", value: recipe.difficulty },
              { label: "Temps total", value: recipe.total_time ?? "—" },
              { label: "Portions", value: recipe.portions ?? "—" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[9px] tracking-widest uppercase text-white/30 mb-1">{label}</p>
                <p className="text-xs font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
          <a
            href="#recette"
            className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase border border-white/30 text-white px-5 py-3 w-fit hover:bg-white hover:text-brown transition-colors"
          >
            Voir la recette complète
          </a>
        </div>

        {/* Droite — image */}
        <div className="relative min-h-[400px] md:min-h-0 bg-[#C4A882]">
          {recipe.image_url ? (
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              fill
              className="object-cover object-center"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#C4A882] to-[#6B4A35]" />
          )}
        </div>
      </section>

      {/* ── RECETTE PAS À PAS ── */}
      <section id="recette" className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-brown/40 mb-2">
          La recette pas à pas
        </p>
        <h2 className="text-[clamp(1.4rem,2.5vw,2rem)] font-bold text-black mb-10">
          {recipe.title}<br />
          <span className="font-normal text-brown/60">par Stéphane Reinat</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12">
          {/* Colonne gauche — ingrédients + matériel */}
          <div className="space-y-8">
            {recipe.ingredients.length > 0 && (
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-brown mb-3 pb-2 border-b border-brown/20">
                  Ingrédients
                </p>
                <ul className="space-y-1.5">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="text-xs text-black/70 leading-relaxed flex gap-2">
                      <span className="text-brown mt-0.5">—</span>
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {recipe.materiel.length > 0 && (
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-brown mb-3 pb-2 border-b border-brown/20">
                  Matériel
                </p>
                <ul className="space-y-1.5">
                  {recipe.materiel.map((m, i) => (
                    <li key={i} className="text-xs text-black/70 leading-relaxed flex gap-2">
                      <span className="text-brown mt-0.5">—</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Colonne droite — étapes */}
          <div className="space-y-8">
            {recipe.steps.map((step, i) => (
              <div key={i} className="flex gap-6">
                <div className="shrink-0">
                  <span className="text-[11px] font-bold text-brown/30 tracking-widest">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex-1 border-t border-brown/10 pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-sm font-bold text-black">{step.title}</h3>
                    {step.chip && (
                      <span className={`text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 ${CHIP_COLORS[step.chip_color] ?? CHIP_COLORS.green}`}>
                        {step.chip}
                      </span>
                    )}
                  </div>
                  <p className="font-editorial font-light italic text-[1rem] text-black/70 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUTRES RECETTES ── */}
      {others.length > 0 && (
        <section className="bg-cream py-14 border-t border-brown/10">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-[clamp(2.2rem,4vw,4.5rem)] font-bold uppercase tracking-tight leading-none text-black">
                Autres<br />recettes
              </h2>
              <Link
                href="/recettes"
                className="text-[10px] font-bold tracking-widests uppercase text-black border-b border-black pb-0.5 hover:opacity-50 transition-opacity"
              >
                Voir tout
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {others.map((r) => (
                <Link
                  key={r.id}
                  href={`/recettes/${r.slug}`}
                  className="group flex flex-col overflow-hidden bg-white border border-brown/10 hover:border-brown/30 transition-colors"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-brown/10">
                    {r.image_url ? (
                      <Image src={r.image_url} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#C4A882] to-[#6B4A35]" />
                    )}
                    {r.badge && (
                      <span className="absolute top-2 left-2 bg-cream text-brown text-[8px] font-bold tracking-widest uppercase px-2 py-0.5">
                        {r.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-1.5">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-brown leading-snug">
                      {r.title}
                    </p>
                    {r.total_time && (
                      <p className="text-[9px] text-brown/40 tracking-wider">{r.total_time}</p>
                    )}
                    <span className="mt-2 text-[9px] font-bold tracking-widest uppercase text-brown/60 border-b border-brown/20 pb-0.5 w-fit">
                      Découvrir la recette →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <InstagramSection />
    </div>
  );
}
