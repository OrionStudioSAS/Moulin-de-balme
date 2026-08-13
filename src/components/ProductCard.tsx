"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import ProductBadge from "@/components/ProductBadge";
import { useCart } from "@/lib/cart-context";

export default function ProductCard({
  product,
  showAddButton = false,
  variant = "default",
}: {
  product: Product;
  showAddButton?: boolean;
  variant?: "default" | "farines";
}) {
  const { addItem } = useCart();
  const isFarines = variant === "farines";

  return (
    <div
      className={
        isFarines
          ? "group flex h-full min-w-0 flex-col bg-brown p-3 text-cream min-[480px]:p-4 lg:p-5"
          : "group"
      }
      data-product-card-variant={variant}
    >
      <Link
        href={`/produits/${product.slug}`}
        className={
          isFarines
            ? "flex min-w-0 flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            : "block"
        }
      >
        <div
          className={
            isFarines
              ? "relative mb-[15px] aspect-square overflow-hidden bg-cream-dark"
              : "aspect-square bg-cream-dark overflow-hidden mb-3 relative"
          }
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className={
                isFarines
                  ? "object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none"
                  : "object-cover group-hover:scale-105 transition-transform duration-500"
              }
            />
          ) : (
            <div
              className="w-full h-full bg-gradient-to-br from-brown/5 to-gold/10"
              aria-hidden="true"
            />
          )}
          {product.badge && (
            <div className={isFarines ? "absolute left-[15px] top-[15px]" : "absolute top-2.5 left-2.5"}>
              <ProductBadge badge={product.badge} />
            </div>
          )}
        </div>
        <p
          className={
            isFarines
              ? "mb-[9px] min-h-[2.25rem] break-words text-[13px] font-medium uppercase leading-[18px] tracking-[0.02em] text-cream lg:text-sm"
              : "text-xs font-medium tracking-wider text-brown mb-1 uppercase"
          }
        >
          {product.name}
        </p>
        <p
          className={
            isFarines
              ? "mb-[9px] break-words text-[11px] font-bold uppercase leading-4 tracking-[0.15em] text-cream/80"
              : "text-xs text-warm-gray tracking-wider mb-2"
          }
        >
          {product.poids && <span className="mr-2">{product.poids}g —</span>}
          {product.weight_prices?.length > 0
            ? `À partir de ${Math.min(...product.weight_prices.map((w) => w.price)).toFixed(2).replace(".", ",")}€`
            : `${product.price.toFixed(2).replace(".", ",")}€`}
        </p>
      </Link>
      {showAddButton && (
        <button
          onClick={() => addItem(product)}
          className={
            isFarines
              ? "block min-h-11 w-full border border-cream/70 bg-brown px-2 py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-cream transition-colors hover:bg-cream hover:text-brown focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none"
              : "block w-full text-center border border-brown text-brown text-[11px] tracking-widest uppercase py-2.5 hover:bg-brown hover:text-cream transition-colors"
          }
          aria-label={isFarines ? `Ajouter ${product.name} au panier` : undefined}
        >
          Ajouter au panier
        </button>
      )}
    </div>
  );
}
