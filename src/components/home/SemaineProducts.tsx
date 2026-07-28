"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";

export default function SemaineProducts({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-3 gap-px bg-brown/10">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/produits/${product.slug}`}
          className="group bg-cream block"
        >
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
          <div className="px-3 py-3 border-b border-brown/8">
            <p className="text-[10px] font-bold tracking-widest uppercase text-brown leading-snug mb-1">
              {product.name}
            </p>
            <p className="text-[9px] tracking-widest uppercase text-brown/50">
              {product.price.toFixed(2).replace(".", ",")}€
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
