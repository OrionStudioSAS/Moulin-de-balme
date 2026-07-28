"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";

export default function SemaineProducts({ products }: { products: Product[] }) {
  const [page, setPage] = useState(0);

  // Grouper par pages de 4
  const pages: Product[][] = [];
  for (let i = 0; i < products.length; i += 4) {
    pages.push(products.slice(i, i + 4));
  }

  const totalPages = pages.length;
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <div className="absolute inset-0 flex flex-col">

      {/* Slider */}
      <div className="flex-1 overflow-hidden relative">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {pages.map((pageProducts, pi) => (
            <div
              key={pi}
              className="w-full h-full flex-shrink-0 grid grid-cols-2 grid-rows-2 gap-px bg-brown/10"
            >
              {pageProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/produits/${product.slug}`}
                  className="group bg-cream flex flex-col overflow-hidden"
                >
                  {/* Image — prend tout l'espace restant */}
                  <div className="relative flex-1 overflow-hidden bg-brown/10 min-h-0">
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
                      <span className="absolute top-2 left-2 bg-[#FEF2E4] text-brown text-[8px] font-bold tracking-widest uppercase px-2 py-0.5">
                        {product.badge === "nouveau" ? "Nouveau"
                          : product.badge === "bestseller" ? "Bestseller"
                          : "Exclusif"}
                      </span>
                    )}
                  </div>

                  {/* Texte — hauteur fixe */}
                  <div className="shrink-0 px-3 py-2.5 border-b border-brown/8">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-brown leading-snug truncate mb-0.5">
                      {product.name}
                    </p>
                    <p className="text-[9px] tracking-widest uppercase text-brown/50">
                      {product.price.toFixed(2).replace(".", ",")}€
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation — visible uniquement si plusieurs pages */}
      {totalPages > 1 && (
        <div className="shrink-0 flex items-center justify-between px-4 py-3 bg-cream border-t border-brown/10">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={!canPrev}
            className="w-8 h-8 flex items-center justify-center border border-brown text-brown disabled:opacity-20 hover:bg-brown hover:text-cream transition-colors"
            aria-label="Page précédente"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Dots */}
          <div className="flex gap-1.5">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-1.5 h-1.5 transition-colors ${i === page ? "bg-brown" : "bg-brown/20"}`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={!canNext}
            className="w-8 h-8 flex items-center justify-center border border-brown text-brown disabled:opacity-20 hover:bg-brown hover:text-cream transition-colors"
            aria-label="Page suivante"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
