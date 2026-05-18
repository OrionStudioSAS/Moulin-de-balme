import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/produits/${product.slug}`} className="group">
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
      </div>
      <p className="text-sm font-medium tracking-wider text-brown mb-1">
        {product.name}
      </p>
      {product.category && (
        <p className="label-tag mb-1">{product.category.name}</p>
      )}
      <p className="text-sm font-bold text-brown">
        {product.price > 0 ? `${product.price.toFixed(2)} €` : "Sur commande"}
      </p>
    </Link>
  );
}
