"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

const TITLE = "text-[35px] font-bold uppercase tracking-tight leading-none";

const CARDS = [
  {
    label: "L'héritage de Lisa",
    image: "/images/histoire-photo.png",
    imageAlt: "Le Fournil de Lisa",
    title: "Hommage\nau Fournil\nde Lisa",
    text: "Avant d'écrire notre propre histoire, nous tenons à rendre hommage à celle qui nous a précédés. Le Fournil de Lisa a été pendant des années l'un des repères du bas de l'avenue Alsace-Lorraine. Une boulangerie sincère, généreuse, où l'on entrait pour une baguette et où l'on ressortait avec des nouvelles du quartier.\n\nLisa et son équipe ont façonné l'âme du lieu. Les habitudes des clients, les odeurs du matin, la disposition de la vitrine — tout cela est leur héritage. Quand nous avons repris la boutique au printemps 2024, nous avons voulu honorer cette mémoire : en gardant les murs, en préservant l'esprit de proximité, en accueillant les anciens clients comme s'ils n'étaient jamais partis.\n\nSi vous étiez fidèle au Fournil de Lisa, vous êtes ici chez vous.",
    textColor: "text-white",
    labelColor: "text-white/40",
    bodyColor: "text-white/60",
  },
  {
    label: "La Renaissance",
    image: "/images/histoire-photo.png",
    imageAlt: "La boutique du Moulin de Balme",
    title: "Printemps\n2025",
    text: "Au printemps 2024, après une année de fermeture, la boutique du 7 avenue Alsace-Lorraine retrouve la vie. Stéphane et Tomoko Reinat poussent la porte, encore en travaux, et imaginent ce qu'elle pourrait devenir.\n\nDe retour de quinze années passées à enseigner la boulangerie française à Tokyo, Hong Kong et Shanghai, Stéphane cherchait depuis des mois un fournil à reprendre. Il voulait un quartier vivant, une clientèle fidèle, un four qui en avait vu d'autres. Brive cochait toutes les cases.\n\nQuelques semaines de chantier plus tard — un coup de peinture, un mobilier repensé par Tomoko, une nouvelle enseigne — la boutique rouvre. Elle s'appelle désormais Le Moulin de Balme.",
    textColor: "text-white",
    labelColor: "text-white/40",
    bodyColor: "text-white/60",
  },
  {
    label: "Le Grand Départ",
    image: "/images/histoire-photo.png",
    imageAlt: "Tokyo — Le Cordon Bleu",
    title: "L'Appren-\ntissage",
    text: "En 2009, une opportunité change tout. Le Cordon Bleu Tokyo cherche un formateur français pour transmettre le savoir-faire de la boulangerie traditionnelle à des élèves japonais. Stéphane n'hésite pas : il embarque pour le Japon avec quelques outils, un livre de recettes, et l'envie d'apprendre autant qu'il enseignera.\n\nAu Japon, il découvre une autre forme d'exigence. Les élèves japonais cherchent la perfection du geste, la propreté absolue, la mesure au gramme près. Lui leur apporte la patience française, la fermentation longue, la confiance dans l'imperfection. Cette rencontre, il ne l'oubliera jamais.\n\nC'est aussi à Tokyo qu'il rencontre Tomoko, qui deviendra son épouse, sa partenaire, et la pâtissière du futur Fournil de Balme.",
    textColor: "text-white",
    labelColor: "text-white/40",
    bodyColor: "text-white/60",
  },
];

export default function HistoireCards() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const checkScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]") as HTMLElement | null;
    const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.7;
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="bg-cream px-6 md:px-12 py-6 md:py-12">
      <div className="max-w-[1400px] mx-auto">
        {/* Slider track */}
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          {CARDS.map((card, i) => (
            <div
              key={i}
              data-card
              className="bg-brown flex-shrink-0 flex flex-col overflow-hidden"
              style={{
                width: "calc((100% - 48px) / 2.25)",
                minWidth: 280,
              }}
            >
              {/* Label */}
              <p className={`${TITLE} ${card.textColor} px-8 pt-8 pb-5`}>
                {card.label}
              </p>

              {/* Image */}
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80vw, 45vw"
                />
              </div>

              {/* Content */}
              <div className="px-8 py-8 flex flex-col gap-5 flex-1">
                <h3 className={`${TITLE} ${card.textColor}`}>
                  {card.title.split("\n").map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < card.title.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </h3>
                <div className={`text-[11px] ${card.bodyColor} leading-relaxed space-y-3`}>
                  {card.text.split("\n\n").map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nav buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => scroll("prev")}
            disabled={!canPrev}
            aria-label="Précédent"
            className="w-10 h-10 border border-brown/30 flex items-center justify-center text-brown hover:bg-brown hover:text-cream transition-colors disabled:opacity-20 disabled:pointer-events-none"
          >
            ←
          </button>
          <button
            onClick={() => scroll("next")}
            disabled={!canNext}
            aria-label="Suivant"
            className="w-10 h-10 border border-brown/30 flex items-center justify-center text-brown hover:bg-brown hover:text-cream transition-colors disabled:opacity-20 disabled:pointer-events-none"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
