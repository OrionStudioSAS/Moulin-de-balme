"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/types";

const BADGE_LABEL: Record<string, string> = {
  nouveau: "Nouveau",
  bestseller: "Bestseller",
  exclusif: "Exclusif",
};

export default function SortieDuFourCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-brown flex flex-col">
      {/* Image */}
      <Link href={`/produits/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden shrink-0">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-brown-dark" />
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-cream text-brown text-[10px] font-bold tracking-widest uppercase px-2.5 py-1">
            {BADGE_LABEL[product.badge] ?? product.badge}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <Link href={`/produits/${product.slug}`}>
            <p className="text-cream text-[11px] font-bold tracking-widest uppercase leading-snug hover:opacity-80 transition-opacity">
              {product.name}
            </p>
          </Link>
          <p className="text-cream/70 text-[11px] tracking-wider mt-1 uppercase">
            À partir de — {product.price.toFixed(2).replace(".", ",")}€
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="w-full border border-cream text-cream text-[10px] font-bold tracking-widest uppercase py-2.5 hover:bg-cream hover:text-brown transition-colors mt-auto"
        >
          {added ? "Ajouté ✓" : "Ajouter au panier"}
        </button>
      </div>
    </div>
  );
}
