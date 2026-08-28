"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

const TITLE = "text-[35px] font-normal uppercase tracking-tight leading-tight";

export interface StoryCard {
  label: string;
  image: string;
  imageAlt: string;
  title: string;
  text: string;
}

export default function StoryCardsSlider({ cards }: { cards: StoryCard[] }) {
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
    <section className="bg-cream pl-6 md:pl-12 pb-6 md:pb-12">
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        {cards.map((card, i) => (
          <div
            key={i}
            data-card
            className="bg-brown flex-shrink-0 flex flex-col overflow-hidden"
            style={{ width: "calc((100vw - 48px) / 2)", minWidth: 320 }}
          >
            <p className={`${TITLE} text-white px-8 pt-8 pb-3 whitespace-nowrap overflow-hidden text-ellipsis`}>
              {card.label}
            </p>
            <div className="relative h-[250px] mx-8">
              <Image
                src={card.image}
                alt={card.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 45vw"
              />
            </div>
            <div className="px-8 py-8 flex flex-col gap-5 flex-1">
              <h3 className={`${TITLE} text-white`}>{card.title}</h3>
              <div className="text-[11px] text-white leading-relaxed space-y-3">
                {card.text.split("\n\n").map((para, j) => (
                  <p key={j}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className="flex-shrink-0 w-6 md:w-12" aria-hidden />
      </div>

      <div className="flex gap-2 mt-6 pr-6 md:pr-12 justify-end">
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
    </section>
  );
}
