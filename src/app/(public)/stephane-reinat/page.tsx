import Image from "next/image";
import Link from "next/link";
import StoryCardsSlider from "@/components/StoryCardsSlider";
import type { StoryCard } from "@/components/StoryCardsSlider";

const TIMELINE_CARDS: StoryCard[] = [
  {
    label: "Le Commencement",
    image: "/images/histoire-photo.png",
    imageAlt: "Stéphane Reinat — ses débuts",
    title: "L'Apprentissage",
    text: "Stéphane Reinat n'a pas grandi dans un fournil. Il y est entré par choix, à seize ans, au CFA de Versailles, parce qu'il aimait l'idée d'un métier qui se lève avec la nuit et qui finit avec l'odeur. Le pain n'était pas une tradition familiale ; il l'a fait sienne.\n\nTrès vite, il comprend que la boulangerie n'est pas qu'une affaire de technique : c'est une affaire de patience, d'écoute du levain, de respect du grain. Pendant ses premières années, il fait ses gammes dans les fournils parisiens — apprend la baguette de tradition, la pâte feuilletée, la cuisson au bois.",
  },
  {
    label: "Le Grand Départ",
    image: "/images/histoire-photo.png",
    imageAlt: "Tokyo — Le Cordon Bleu",
    title: "Tokyo, Premier Exil",
    text: "En 2009, une opportunité change tout. Le Cordon Bleu Tokyo cherche un formateur français pour transmettre le savoir-faire de la boulangerie traditionnelle à des élèves japonais. Stéphane n'hésite pas : il embarque pour le Japon avec quelques outils, un livre de recettes, et l'envie d'apprendre autant qu'il enseignera.\n\nAu Japon, il découvre une autre forme d'exigence. Les élèves japonais cherchent la perfection du geste, la propreté absolue, la mesure au gramme près. Lui leur apporte la patience française, la fermentation longue, la confiance dans l'imperfection. Cette rencontre, il ne l'oubliera jamais. C'est aussi à Tokyo qu'il rencontre Tomoko, qui deviendra son épouse, sa partenaire, et la pâtissière du futur Fournil de Balme.",
  },
];
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";
import SortieDuFourCard from "@/components/home/SortieDuFourCard";

const H2 = "text-[clamp(2.2rem,4vw,4.5rem)] font-bold uppercase tracking-tight leading-none";

export default async function StephaneReinatPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_available", true)
    .eq("is_featured", true)
    .order("sort_order")
    .limit(4);

  const items = (products ?? []) as Product[];

  return (
    <div className="bg-cream">

      {/* ─── 1. HERO — LE BOULANGER ─── */}
      <section className="relative overflow-hidden bg-brown mt-[-64px] h-[465px]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-banner.png"
            alt="Stéphane Reinat — Le Boulanger"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-end max-w-[1400px] mx-auto px-6 md:px-12 pb-16 pt-40">
          <p className="text-sm font-medium tracking-[0.15em] uppercase text-white/60 mb-3">
            Stéphane Reinat un parcours qui sent bon le pain chaud
          </p>
          <h1 className={`${H2} text-white mb-4`}>
            Le<br />Boulanger
          </h1>
          <p className="text-sm text-white/70 leading-relaxed max-w-xl">
            De Tokyo à Brive, en passant par Hong Kong et Shanghai. Quinze années à enseigner
            la boulangerie française aux quatre coins du monde — avant de poser ses mains, enfin,
            sur la pâte d&apos;un fournil à lui.
          </p>
        </div>
      </section>

      {/* ─── 2. BIO — STÉPHANE REINAT ─── */}
      <section className="grid grid-cols-1 md:grid-cols-2 bg-cream mb-6 md:mb-12">
        <div className="relative min-h-[500px] md:min-h-[680px]">
          <Image
            src="/images/histoire-photo.png"
            alt="Stéphane et Tomoko Reinat"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="flex flex-col justify-center px-10 md:px-16 py-16">
          <h2 className={`${H2} text-black mb-4`}>
            Stéphane<br />Reinat
          </h2>
          <p className="text-sm font-medium tracking-[0.15em] uppercase text-black mb-8 leading-relaxed">
            DE TOKYO À BRIVE ... Le retour aux sources d&apos;un globe-trotter
          </p>
          {/* Stats */}
          <ul className="space-y-2 mb-8">
            {[
              "15 ans passés à enseigner la boulangerie française en Asie — 3 pays : Japon, Chine, Hong Kong",
              "1 retour à la terre, à Brive, en 2024",
              "1 levain élevé chaque jour depuis l'ouverture du Fournil de Balme",
            ].map((s) => (
              <li key={s} className="flex items-start gap-2 text-xs text-black/70 leading-relaxed">
                <span className="w-1 h-1 bg-brown shrink-0 mt-1.5" />
                {s}
              </li>
            ))}
          </ul>
          <div className="text-sm text-black/70 leading-relaxed max-w-md space-y-4">
            <p>
              On parle souvent de Stéphane, parce qu&apos;il est devant le four. Mais le Fournil de
              Balme ne serait pas ce qu&apos;il est sans Tomoko Reinat. Pâtissière de formation, elle
              s&apos;occupe des viennoiseries, des tartes, des biscuits sablés. C&apos;est elle qui a
              apporté la précision japonaise dans les dosages, la délicatesse des décors,
              l&apos;idée d&apos;utiliser le yuzu et le matcha.
            </p>
            <p>
              Elle anime aussi la boutique, et accueille les clients avec cette douceur qui,
              dit-on, fait la moitié de la réputation du fournil.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 3. TIMELINE SLIDER ─── */}
      <StoryCardsSlider cards={TIMELINE_CARDS} />

      {/* ─── 4. TOMOKO REINAT ─── */}
      <section className="bg-cream grid grid-cols-1 md:grid-cols-2">
        <div className="px-10 md:px-14 py-16 flex flex-col gap-8">
          <h2 className={`${H2} text-black`}>Tomoko<br />Reinat</h2>
          <p className="text-sm font-medium tracking-[0.15em] uppercase text-black leading-relaxed">
            DE TOKYO À BRIVE ... Le retour aux sources d&apos;un globe-trotter
          </p>
          <ul className="space-y-2">
            {[
              "15 ans passés à enseigner la boulangerie française en Asie — 3 pays : Japon, Chine, Hong Kong",
              "1 retour à la terre, à Brive, en 2024",
              "1 levain élevé chaque jour depuis l'ouverture du Fournil de Balme",
            ].map((s) => (
              <li key={s} className="flex items-start gap-2 text-xs text-black/70 leading-relaxed">
                <span className="w-1 h-1 bg-brown shrink-0 mt-1.5" />
                {s}
              </li>
            ))}
          </ul>
          <div className="text-sm text-black/70 leading-relaxed max-w-md space-y-4">
            <p>
              On parle souvent de Stéphane, parce qu&apos;il est devant le four. Mais le Fournil de
              Balme ne serait pas ce qu&apos;il est sans Tomoko Reinat. Pâtissière de formation, elle
              s&apos;occupe des viennoiseries, des tartes, des biscuits sablés. C&apos;est elle qui a
              apporté la précision japonaise dans les dosages, la délicatesse des décors,
              l&apos;idée d&apos;utiliser le yuzu et le matcha.
            </p>
            <p>
              Elle anime aussi la boutique, et accueille les clients avec cette douceur qui,
              dit-on, fait la moitié de la réputation du fournil.
            </p>
          </div>
        </div>
        <div className="relative min-h-[500px]">
          <Image
            src="/images/histoire-photo.png"
            alt="Tomoko Reinat"
            fill
            className="object-cover object-top"
          />
        </div>
      </section>

      {/* ─── 5. L'ART BOULANGER À VOTRE TABLE ─── */}
      <section className="bg-cream py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-8">
            <h2 className={`${H2} text-black`}>
              L&apos;art boulanger<br />à votre table.
            </h2>
            <Link
              href="/produits"
              className="text-[11px] font-bold tracking-widest uppercase text-black border-b border-black pb-0.5 hover:opacity-50 transition-opacity whitespace-nowrap shrink-0 ml-8"
            >
              Voir toutes les recettes
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((product) => (
              <SortieDuFourCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. LES TOQUÉS DU JAPON ─── */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="bg-[#2A1F1A] px-10 md:px-14 py-16 flex flex-col justify-between min-h-[480px]">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-6">
              VU SUR M6
            </p>
            <h2 className={`${H2} text-white mb-6`}>
              Les Toqués<br />du Japon
            </h2>
            <p className="text-xs text-white/60 leading-relaxed max-w-sm mb-10">
              M6 lui a consacré un portrait dans ce documentaire culinaire tourné au cœur du
              Japon — un voyage entre deux cultures boulangères, entre tradition française et
              précision nippone. Une rencontre rare, à voir absolument.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-3 border border-white/30 text-white text-[10px] font-bold tracking-widest uppercase px-5 py-3 hover:bg-white/10 transition-colors w-fit"
          >
            ▶&nbsp;&nbsp;Regarder sur M6
          </a>
        </div>
        <div className="relative min-h-[480px] bg-brown/20 overflow-hidden group cursor-pointer">
          <Image
            src="/images/toques-du-japon.jpg"
            alt="Les Toqués du Japon — M6"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="ml-1">
                <path d="M5 3L17 10L5 17V3Z" fill="#4B3A33" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. LE SECRET DU CROISSANT PARFAIT ─── */}
      <section className="bg-[#1A1410] py-20 px-6">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/30 mb-3">
            Le beurre sec
          </p>
          <h2 className={`${H2} text-white mb-10`}>
            Le secret du<br />croissant parfait
          </h2>
          <blockquote className="text-[clamp(1.2rem,2vw,1.8rem)] font-light text-white leading-relaxed italic mb-12 border-l border-white/20 pl-8">
            « La qualité des ingrédients prime sur tout.<br />
            Un beurre de tourage sec, à point de fusion<br />
            élevé, c&apos;est 80% du résultat. La technique<br />
            vient ensuite — mais sans le bon beurre,<br />
            aucune technique ne suffit. »
          </blockquote>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-10">
            {[
              {
                label: "Le beurre sec",
                body: "Point de fusion ~32°C. Pas de fonte prématurée pendant le tourage — le beurre reste en feuille, le feuilletage se développe.",
              },
              {
                label: "La texture",
                body: "Légère, aérée, régulière. L'alvéolage révèle la qualité du tourage et la juste fermentation.",
              },
              {
                label: "Les notes lactiques",
                body: "Le beurre doit sentir le vrai beurre frais — une légère acidité, de la profondeur. Pas de goût neutre.",
              },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-2">◉</p>
                <p className="text-sm font-bold text-white mb-2">{item.label}</p>
                <p className="text-xs text-white/50 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] tracking-widest uppercase text-white/30 mt-10">
            — Stéphane Reinat
          </p>
        </div>
      </section>

      {/* ─── 8. FORMATIONS & STAGES ─── */}
      <section className="bg-cream py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-brown/50 mb-3">
            Formations &amp; Stages
          </p>
          <h2 className={`${H2} text-black mb-4`}>
            Apprenez à ses côtés.
          </h2>
          <p className="text-sm text-black/60 leading-relaxed max-w-xl mb-12">
            Stéphane Reinat partage son savoir-faire au travers de deux dispositifs
            complémentaires : des stages en immersion à Saint-Julien et un programme annuel
            à l&apos;École Auriac.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Saint-Julien */}
            <div className="border border-brown/20 p-8 flex flex-col gap-6 hover:border-brown transition-colors">
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-brown/50 mb-1">
                  Stage en immersion
                </p>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-black mb-1">
                  Saint-Julien
                </h3>
                <p className="text-xs text-black/50 mb-5">
                  Boulangerie artisanale · Immersion 2 à 5 jours
                </p>
                <ul className="space-y-1.5">
                  {[
                    "Prise en main du pétrin et du four",
                    "Techniques de tourage & façonnage",
                    "Recettes signature du Chef Reinat",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-black/70">
                      <span className="text-brown">—</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1 border-t border-brown/10 pt-5">
                {[
                  { date: "Mars 2025", label: "Initiation — Week-end" },
                  { date: "Mai 2025", label: "Viennoiseries avancées" },
                  { date: "Sept. 2025", label: "Pains au levain" },
                ].map((s) => (
                  <div key={s.date} className="flex justify-between text-xs">
                    <span className="text-black/50">{s.date}</span>
                    <span className="text-black/70">{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-auto">
                <p className="text-[9px] text-brown/40 tracking-wider">saint-julien-boulangerie.fr/stages</p>
                <Link
                  href="/#contact"
                  className="text-[10px] font-bold tracking-widest uppercase border border-black text-black px-5 py-2.5 hover:bg-black hover:text-cream transition-colors text-center"
                >
                  Voir les disponibilités →
                </Link>
              </div>
            </div>

            {/* Aurillac */}
            <div className="border border-brown/20 p-8 flex flex-col gap-6 hover:border-brown transition-colors">
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-brown/50 mb-1">
                  École de boulangerie
                </p>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-black mb-1">
                  Aurillac
                </h3>
                <p className="text-xs text-black/50 mb-5">
                  Programme annuel · Niveaux initiation &amp; perfectionnement
                </p>
                <ul className="space-y-1.5">
                  {[
                    "Prise en main du pétrin et du four",
                    "Techniques de tourage & façonnage",
                    "Recettes signature du Chef Reinat",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-black/70">
                      <span className="text-brown">—</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-2 mt-auto">
                <p className="text-[9px] text-brown/40 tracking-wider">ecole-auriac.fr/programme-boulangerie</p>
                <Link
                  href="/#contact"
                  className="text-[10px] font-bold tracking-widest uppercase border border-black text-black px-5 py-2.5 hover:bg-black hover:text-cream transition-colors text-center"
                >
                  Voir le calendrier →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Instagram + Press ─── */}

    </div>
  );
}
