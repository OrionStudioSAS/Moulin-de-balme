"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import {
  requiresProductSelection,
  selectCartRecommendations,
  selectRandomAvailableProducts,
} from "@/lib/cart-recommendations";
import type { Product } from "@/types";

function formatPrice(product: Product) {
  const weightPrices = Array.isArray(product.weight_prices) ? product.weight_prices : [];
  const price = weightPrices.length > 0
    ? Math.min(...weightPrices.map(({ price }) => price))
    : product.price;
  return `${weightPrices.length > 0 ? "À partir de " : ""}${price
    .toFixed(2)
    .replace(".", ",")} €`;
}

export default function CartRecommendations({ products }: { products: Product[] | null }) {
  const { items, addItem, hydrated, setOpen } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const addingRef = useRef(new Set<string>());
  const emptyCartRecommendations = useMemo(
    () => selectRandomAvailableProducts(products ?? []),
    [products],
  );
  const recommendations = useMemo(
    () => items.length === 0
      ? emptyCartRecommendations
      : selectCartRecommendations(products ?? [], items),
    [emptyCartRecommendations, items, products],
  );

  const handleAdd = (product: Product) => {
    if (addingRef.current.has(product.id)) return;
    addingRef.current.add(product.id);
    setAddingId(product.id);
    setMessage("");

    try {
      addItem(product);
      setMessage(`${product.name} a été ajouté au panier.`);
    } catch {
      setMessage(`Impossible d’ajouter ${product.name}. Veuillez réessayer.`);
    } finally {
      window.setTimeout(() => {
        addingRef.current.delete(product.id);
        setAddingId((current) => current === product.id ? null : current);
      }, 500);
    }
  };

  return (
    <section className="border-t border-brown/10 pt-5" aria-labelledby="cart-recommendations-title">
      <h2
        id="cart-recommendations-title"
        className="text-xs font-bold tracking-widest uppercase text-brown mb-4"
      >
        Ces produits pourraient vous plaire
      </h2>

      {!hydrated ? (
        <div className="space-y-3" role="status" aria-label="Chargement des recommandations">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-20 bg-cream-dark animate-pulse motion-reduce:animate-none" />
          ))}
        </div>
      ) : products === null ? (
        <p className="text-xs text-warm-gray leading-relaxed" role="status">
          Les suggestions sont indisponibles pour le moment. Votre panier reste utilisable.
        </p>
      ) : recommendations.length === 0 ? (
        <p className="text-xs text-warm-gray leading-relaxed" role="status">
          Aucun autre produit disponible pour le moment.
        </p>
      ) : (
        <ul className="space-y-3">
          {recommendations.map((product) => {
            const needsSelection = requiresProductSelection(product);
            const isAdding = addingId === product.id;

            return (
              <li key={product.id} className="flex gap-3 border border-brown/10 bg-cream-dark/40 p-2.5">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-cream-dark">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="h-full w-full bg-gradient-to-br from-brown/5 to-gold/15"
                      role="img"
                      aria-label={`Image non disponible pour ${product.name}`}
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium tracking-wider text-brown uppercase">
                    {product.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-warm-gray">
                    {product.poids ? `${product.poids} g — ` : ""}{formatPrice(product)}
                  </p>
                  {needsSelection ? (
                    <Link
                      href={`/produits/${product.slug}`}
                      onClick={() => setOpen(false)}
                      className="mt-2 inline-flex min-h-8 items-center border border-brown px-3 text-[10px] tracking-widest uppercase text-brown transition-colors hover:bg-brown hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown"
                      aria-label={`Choisir une variante pour ${product.name}`}
                    >
                      Choisir
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAdd(product)}
                      disabled={isAdding}
                      className="mt-2 min-h-8 border border-brown px-3 text-[10px] tracking-widest uppercase text-brown transition-colors hover:bg-brown hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown disabled:cursor-wait disabled:opacity-60"
                      aria-label={`Ajouter ${product.name} au panier`}
                    >
                      {isAdding ? "Ajout…" : "Ajouter"}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p
        className={`mt-3 text-[11px] leading-relaxed text-brown ${message ? "block" : "sr-only"}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </p>
    </section>
  );
}
