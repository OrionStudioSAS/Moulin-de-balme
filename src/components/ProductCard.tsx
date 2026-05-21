"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import ProductBadge from "@/components/ProductBadge";
import { useCart } from "@/lib/cart-context";

export default function ProductCard({
  product,
  showAddButton = false,
}: {
  product: Product;
  showAddButton?: boolean;
}) {
  const { addItem } = useCart();

  return (
    <div className="group">
      <Link href={`/produits/${product.slug}`} className="block">
        <div className="aspect-square bg-cream-dark overflow-hidden mb-3 relative">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brown/5 to-gold/10" />
          )}
          {product.badge && (
            <div className="absolute top-2.5 left-2.5">
              <ProductBadge badge={product.badge} />
            </div>
          )}
        </div>
        <p className="text-xs font-medium tracking-wider text-brown mb-1 uppercase">
          {product.name}
        </p>
        <p className="text-xs text-warm-gray tracking-wider mb-2">
          À partir de — {product.price.toFixed(2).replace(".", ",")}€
        </p>
      </Link>
      {showAddButton && (
        <button
          onClick={() => addItem(product)}
          className="block w-full text-center border border-brown text-brown text-[11px] tracking-widest uppercase py-2.5 hover:bg-brown hover:text-cream transition-colors"
        >
          Ajouter au panier
        </button>
      )}
    </div>
  );
}
