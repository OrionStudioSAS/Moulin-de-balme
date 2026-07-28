"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";

export default function SemaineProducts({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 8);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll);
    return () => el?.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollDown = () => {
    scrollRef.current?.scrollBy({ top: 400, behavior: "smooth" });
  };

  return (
    <div className="relative h-full">
      {/* Grille scrollable */}
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto scrollbar-hide"
        style={{ maxHeight: "inherit" }}
      >
        <div className="grid grid-cols-2 gap-px bg-brown/10">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/produits/${product.slug}`}
              className="group bg-cream block"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-brown/10">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#C4A882] to-[#6B4A35]" />
                )}
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-[#FEF2E4] text-brown text-[9px] font-bold tracking-widest uppercase px-2 py-1">
                    {product.badge === "nouveau" ? "Nouveau"
                      : product.badge === "bestseller" ? "Bestseller"
                      : "Exclusif"}
                  </span>
                )}
              </div>

              {/* Texte */}
              <div className="px-4 py-4 border-b border-brown/8">
                <p className="text-[11px] font-bold tracking-widest uppercase text-brown leading-snug mb-2">
                  {product.name}
                </p>
                <p className="text-[10px] tracking-widest uppercase text-brown/50">
                  À partir de — {product.price.toFixed(2).replace(".", ",")}€
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Flèche scroll vers le bas */}
      {canScrollDown && (
        <button
          onClick={scrollDown}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-brown text-cream flex items-center justify-center hover:bg-brown/80 transition-colors shadow-md z-10"
          aria-label="Voir plus de produits"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 4.5L7 9.5L12 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}
