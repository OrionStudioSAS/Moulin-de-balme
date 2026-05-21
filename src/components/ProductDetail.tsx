"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product, ProductVariation } from "@/types";
import ProductBadge from "@/components/ProductBadge";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/lib/cart-context";

const ACCORDIONS = [
  { key: "ingredients", label: "Ingrédients et allergènes" },
  { key: "conservation", label: "Conservation et valeurs nutritionnelles" },
  { key: "savoir_faire", label: "Savoir-faire" },
  { key: "le_saviez_vous", label: "Le saviez-vous ?" },
] as const;

function Countdown() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(17, 0, 0, 0);
      if (now >= cutoff) cutoff.setDate(cutoff.getDate() + 1);
      const diff = cutoff.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000).toString().padStart(2, "0");
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0");
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
      setTime(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="text-xl font-bold tracking-widest tabular-nums">{time}</span>;
}

export default function ProductDetail({ product, similar }: { product: Product; similar: Product[] }) {
  const { addItem } = useCart();
  const [accordionOpen, setAccordionOpen] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [tranche, setTranche] = useState(false);
  const [added, setAdded] = useState(false);

  const variations: ProductVariation[] = Array.isArray(product.variations) ? product.variations : [];
  const currentPrice = product.price + (variations[selectedVariation]?.price_modifier ?? 0);

  const toggle = (key: string) => setAccordionOpen(accordionOpen === key ? null : key);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem(product, selectedVariation, tranche);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <nav className="flex gap-2 items-center text-[11px] tracking-widest uppercase text-warm-gray">
          <Link href="/" className="hover:text-brown transition-colors">Accueil</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/produits?categorie=${product.category.slug}`} className="hover:text-brown transition-colors">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-brown">{product.name}</span>
        </nav>
      </div>

      {/* Main layout */}
      <div className="max-w-[1400px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

          {/* LEFT — Info */}
          <div className="lg:pr-16 py-6 order-2 lg:order-1">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-5xl md:text-6xl font-bold tracking-widest uppercase text-brown leading-none">
                {product.name}
              </h1>
              <span className="text-3xl font-bold text-brown shrink-0 mt-2">
                {currentPrice.toFixed(2).replace(".", ",")}€
              </span>
            </div>

            {product.subtitle && (
              <p className="text-xs tracking-widest uppercase text-warm-gray italic mb-6">
                {product.subtitle}
              </p>
            )}

            {product.description && (
              <p className="text-sm text-brown/70 leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Selectors */}
            <div className={`grid gap-4 mb-8 ${variations.length > 0 ? "grid-cols-2" : "grid-cols-1 max-w-[200px]"}`}>
              {variations.length > 0 && (
                <div>
                  <p className="text-[11px] tracking-widest uppercase text-brown mb-2">Taille</p>
                  <div className="relative">
                    <select
                      value={selectedVariation}
                      onChange={(e) => setSelectedVariation(Number(e.target.value))}
                      className="w-full border border-brown/30 bg-cream px-3 py-2.5 text-xs text-brown appearance-none pr-8 focus:outline-none focus:border-brown"
                    >
                      {variations.map((v, i) => (
                        <option key={i} value={i}>
                          {v.label}{v.price_modifier !== 0 ? ` — ${(product.price + v.price_modifier).toFixed(2).replace(".", ",")}€` : ""}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/40 pointer-events-none">∨</span>
                  </div>
                </div>
              )}
              <div>
                <p className="text-[11px] tracking-widest uppercase text-brown mb-2">Tranché</p>
                <div className="relative">
                  <select
                    value={tranche ? "oui" : "non"}
                    onChange={(e) => setTranche(e.target.value === "oui")}
                    className="w-full border border-brown/30 bg-cream px-3 py-2.5 text-xs text-brown appearance-none pr-8 focus:outline-none focus:border-brown"
                  >
                    <option value="non">Non</option>
                    <option value="oui">Oui</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/40 pointer-events-none">∨</span>
                </div>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-brown/10 mb-8">
              {ACCORDIONS.map(({ key, label }) => {
                const content = product[key as keyof Product] as string | null;
                if (!content) return null;
                return (
                  <div key={key} className="border-b border-brown/10">
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex justify-between items-center py-4 text-left"
                    >
                      <span className="text-[11px] tracking-widest uppercase text-brown font-medium">
                        {label}
                      </span>
                      <span className="text-brown/40 text-xl leading-none">
                        {accordionOpen === key ? "−" : "+"}
                      </span>
                    </button>
                    {accordionOpen === key && (
                      <p className="text-sm text-warm-gray leading-relaxed pb-4">{content}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Click & Collect banner */}
            <div className="bg-brown text-cream p-5 flex items-center gap-4 mb-6">
              <div className="flex-1">
                <p className="text-xs font-bold tracking-widest uppercase mb-1">
                  Click &amp; Collect — Commandez
                </p>
                <p className="text-xs text-cream/60 tracking-wider leading-relaxed">
                  Passez commande avant 17h pour un retrait dès le lendemain 7h en boutique.
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] tracking-widest uppercase text-cream/50 mb-0.5">Clôture dans</p>
                <Countdown />
              </div>
            </div>

            {/* Qty + Add to cart */}
            <div className="flex gap-0">
              <div className="flex items-center border border-brown/30">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-12 text-brown hover:bg-brown/5 transition-colors"
                >
                  −
                </button>
                <span className="w-10 h-12 border-l border-r border-brown/20 flex items-center justify-center text-sm font-bold text-brown">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-12 text-brown hover:bg-brown/5 transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAdd}
                className={`flex-1 text-cream flex items-center justify-center text-xs tracking-widest uppercase font-medium h-12 px-6 transition-colors ${
                  added ? "bg-green-700" : "bg-brown hover:bg-brown-light"
                }`}
              >
                {added ? "Ajouté ✓" : `Ajouter au panier — ${(currentPrice * qty).toFixed(2).replace(".", ",")}€`}
              </button>
            </div>
          </div>

          {/* RIGHT — Image */}
          <div className="order-1 lg:order-2 relative aspect-[4/5] lg:aspect-auto lg:min-h-[600px]">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brown/10 to-gold/20 min-h-[400px]" />
            )}
            {product.badge && (
              <div className="absolute top-4 left-4">
                <ProductBadge badge={product.badge} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vous aimerez aussi */}
      {similar.length > 0 && (
        <section className="bg-cream-dark py-14">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex justify-between items-baseline mb-8">
              <h2 className="text-3xl md:text-4xl font-bold tracking-widest uppercase text-brown">
                Vous aimerez aussi
              </h2>
              <Link href="/produits" className="text-[11px] tracking-widest uppercase text-warm-gray hover:text-brown transition-colors">
                Voir tout
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similar.map((p) => (
                <ProductCard key={p.id} product={p} showAddButton />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
