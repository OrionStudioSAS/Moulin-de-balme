import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";
import InstagramSection from "@/components/home/InstagramSection";
import SortieDuFourCard from "@/components/home/SortieDuFourCard";

export default async function StephaneReinatPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_available", true)
    .eq("is_featured", true)
    .order("sort_order")
    .limit(5);

  const items = (products ?? []) as Product[];

  return (
    <div className="bg-cream">

      {/* ─── 1. HERO — LE BOULANGER ─── */}
      <section className="relative overflow-hidden bg-brown mt-[-64px]" style={{ minHeight: "80vh" }}>
        <div className="absolute inset-0">
          <Image
            src="/images/stephane-hero.jpg"
            alt="Stéphane Reinat — Le Boulanger"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-end max-w-[1400px] mx-auto px-6 md:px-12 pb-16 pt-40">
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/60 mb-3">
            Stéphane Reinat — le parcours du best bof le pain chaud
          </p>
          <h1 className="text-[clamp(3rem,8vw,8rem)] font-bold uppercase tracking-tight leading-none text-white mb-4">
            Le<br />Boulanger
          </h1>
          <p className="text-sm text-white/70 leading-relaxed max-w-xl">
            Après vingt ans à parcourir le monde — Paris, les Alpes, Tokyo, Pékin, Hong Kong —
            Stéphane Reinat pose ses valises à Brive-la-Gaillarde et rouvre le Fournil de Balme.
            Sa boulangerie, son levain, ses farines.
          </p>
        </div>
      </section>

      {/* ─── 2. BIO — STÉPHANE REINAT ─── */}
      <section className="grid grid-cols-1 md:grid-cols-2 bg-cream">
        <div className="relative min-h-[500px] md:min-h-[680px]">
          <Image
            src="/images/histoire-photo.png"
            alt="Stéphane et Tomoko Reinat"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="flex flex-col justify-center px-10 md:px-16 py-16">
          <h2 className="text-[clamp(2.2rem,4vw,4.5rem)] font-bold uppercase tracking-tight leading-none text-black mb-4">
            Stéphane<br />Reinat
          </h2>
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-black mb-10 leading-relaxed">
            De Tokyo à Brive — le retour aux sources d&apos;un globe-trotter
          </p>
          <div className="space-y-4 text-sm text-black leading-relaxed max-w-md">
            <p>
              Une réouverture aux allures de retour aux sources pour le boulanger lotois Stéphane
              Reinat, originaire de Saint-Denis-lès-Martel, et un sacré changement de décor pour
              sa compagne japonaise, Tomoko, originaire de Yokohama.
            </p>
            <p>
              Le couple s&apos;est rencontré à Tokyo, là où Stéphane officiait comme professeur de
              boulangerie à l&apos;école du Cordon Bleu. &laquo;&nbsp;Elle a été une de mes
              élèves&nbsp;&raquo;, sourit l&apos;artisan.
            </p>
            <p>
              Après un apprentissage classique dans l&apos;Hexagone puis vingt ans en Asie,
              Stéphane revient au pays avec ses bagages plein de techniques et d&apos;influences.
              Au Fournil de Balme, tout est fait à la main, tout sort du four le matin.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 3. TIMELINE — LE COMMENCEMENT / LE GRAND DÉPART ─── */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        {/* Gauche — L'Apprentissage */}
        <div className="bg-[#E8D5A3] px-10 md:px-14 py-14 flex flex-col justify-between min-h-[440px]">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-brown/60 mb-8">
            Le Commencement
          </p>
          <div>
            <h3 className="text-[clamp(1.8rem,3vw,3rem)] font-bold uppercase tracking-tight leading-none text-brown mb-6">
              L&apos;Apprentissage
            </h3>
            <p className="text-xs text-brown/70 leading-relaxed max-w-sm">
              Stéphane Reinat grandit dans le Lot, à Saint-Denis-lès-Martel. Il se forme à la
              boulangerie traditionnelle française, apprend la rigueur du feuilletage, la patience
              du levain, le respect des températures. Un apprentissage &laquo;&nbsp;classique&nbsp;&raquo;
              qui lui ouvre les portes de la région parisienne, puis des Alpes-de-Haute-Provence.
            </p>
          </div>
        </div>
        {/* Droite — Tokyo */}
        <div className="relative min-h-[440px] overflow-hidden">
          <Image
            src="/images/tokyo-photo.jpg"
            alt="Tokyo — Premier exil"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-10 md:p-14">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/60 mb-4">
              Le Grand Départ
            </p>
            <h3 className="text-[clamp(1.8rem,3vw,3rem)] font-bold uppercase tracking-tight leading-none text-white mb-4">
              Tokyo,<br />Premier Exil
            </h3>
            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              En 2006, une opportunité unique se présente : enseigner la boulangerie au Cordon
              Bleu de Tokyo. Stéphane saute le pas. Au Japon, il découvre une culture du détail,
              de la précision et du respect du produit qui va transformer sa vision du métier.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 4. TOMOKO REINAT ─── */}
      <section className="bg-cream">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-16 pb-0">
          <h2 className="text-[clamp(3rem,9vw,9rem)] font-bold uppercase tracking-tight leading-none text-black mb-0">
            Tomoko<br />Reinat
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 items-start">
          <div className="px-6 md:px-12 pt-6 pb-16">
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-black mb-8 leading-relaxed">
              Le retour aux sources d&apos;un globe-trotter
            </p>
            <div className="space-y-4 text-sm text-black leading-relaxed max-w-md">
              <p>
                Tomoko Ikeda est née à Yokohama. Étudiante au Cordon Bleu de Tokyo, elle
                rencontre son futur mari dans les fourneaux de l&apos;école. Elle partage
                depuis son aventure boulangère à travers l&apos;Asie — Tokyo, Pékin, Hong Kong.
              </p>
              <p>
                À Brive, Tomoko est l&apos;âme discrète du Fournil de Balme. Elle gère la
                vente, les créations sucrées, les finitions japonaises qui glissent dans les
                recettes de Stéphane — une touche d&apos;umami dans le pain au levain.
              </p>
              <p>
                Son influence est partout : dans le soin du détail, la présentation des
                pièces, le sourire derrière le comptoir.
              </p>
            </div>
          </div>
          <div className="relative min-h-[480px]">
            <Image
              src="/images/tomoko-photo.jpg"
              alt="Tomoko Reinat"
              fill
              className="object-cover object-top"
            />
          </div>
        </div>
      </section>

      {/* ─── 5. L'ART BOULANGER À VOTRE TABLE ─── */}
      <section className="bg-cream py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-[clamp(2.2rem,4vw,4.5rem)] font-bold uppercase tracking-tight leading-none text-black">
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
            {items.slice(0, 4).map((product) => (
              <SortieDuFourCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. LES TOQUÉS DU JAPON ─── */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        {/* Gauche — texte sombre */}
        <div className="bg-[#2A1F1A] px-10 md:px-14 py-16 flex flex-col justify-between min-h-[480px]">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-6">
              S3 EP4 VIE
            </p>
            <h2 className="text-[clamp(2.2rem,4vw,4.5rem)] font-bold uppercase tracking-tight leading-none text-white mb-6">
              Les Toqués<br />du Japon
            </h2>
            <p className="text-xs text-white/60 leading-relaxed max-w-sm mb-10">
              Stéphane Reinat a participé à l&apos;émission culinaire &laquo;&nbsp;Les Toqués du
              Japon&nbsp;&raquo;, diffusée sur Vie. L&apos;épisode retrace son aventure nippone —
              sa rencontre avec Tomoko, son amour des farines locales, et son retour au bercail.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 border border-white/30 text-white text-[10px] font-bold tracking-widest uppercase px-5 py-3 hover:bg-white/10 transition-colors w-fit"
          >
            Voir l&apos;épisode
          </a>
        </div>
        {/* Droite — thumbnail vidéo */}
        <div className="relative min-h-[480px] bg-brown/20 overflow-hidden group cursor-pointer">
          <Image
            src="/images/toques-du-japon.jpg"
            alt="Les Toqués du Japon"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
          {/* Bouton Play */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="ml-1">
                <path d="M5 3L17 10L5 17V3Z" fill="#4B3A33" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. CITATION ─── */}
      <section className="bg-[#1A1410] py-20 px-6">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/30 mb-8">
            Stéphane Reinat — Artisan Boulanger
          </p>
          <blockquote className="text-[clamp(1.3rem,2.5vw,2.2rem)] font-light text-white leading-relaxed italic mb-8">
            &laquo;&nbsp;La qualité des ingrédients prime sur tout. Un beurre de tourage sec, à point
            de fusion élevé, c&apos;est 80% du résultat. La technique vient ensuite — mais sans le bon
            beurre, aucune technique ne suffit.&nbsp;&raquo;
          </blockquote>
          <p className="text-[11px] tracking-widest uppercase text-white/40">
            Stéphane Reinat
          </p>
        </div>
      </section>

      {/* ─── 8. COURS — APPRENEZ À SES CÔTÉS ─── */}
      <section className="bg-cream py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-brown/50 mb-3">
            Formations artisanales
          </p>
          <h2 className="text-[clamp(2.2rem,4vw,4.5rem)] font-bold tracking-tight leading-none text-black mb-12">
            Apprenez à ses côtés.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                location: "Saint-Julien",
                type: "Stage immersif — 3 jours",
                features: [
                  "Initiation au levain naturel",
                  "Façonnage des pains de tradition",
                  "Feuilletage et viennoiseries",
                  "Accès au fournil professionnel",
                ],
                price: "Sur demande",
              },
              {
                location: "Aurillac",
                type: "Masterclass — 1 journée",
                features: [
                  "Technique du croissant parfait",
                  "Sélection et travail des farines",
                  "Session dégustation commentée",
                  "Petit groupe — 6 personnes max",
                ],
                price: "Sur demande",
              },
            ].map((course) => (
              <div
                key={course.location}
                className="border border-brown/20 p-8 flex flex-col justify-between gap-8 hover:border-brown transition-colors"
              >
                <div>
                  <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-brown/50 mb-1">
                    {course.type}
                  </p>
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-black mb-6">
                    {course.location}
                  </h3>
                  <ul className="space-y-2">
                    {course.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-black/70">
                        <span className="w-1 h-1 bg-brown shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-widest uppercase text-brown/50">{course.price}</span>
                  <Link
                    href="/#contact"
                    className="text-[10px] font-bold tracking-widest uppercase border border-black text-black px-5 py-2.5 hover:bg-black hover:text-cream transition-colors"
                  >
                    Nous contacter
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Instagram + Press ─── */}
      <InstagramSection />

    </div>
  );
}
