"use client";

import { useCart } from "@/lib/cart-context";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRef } from "react";
import CartRecommendations from "@/components/CartRecommendations";
import type { Product } from "@/types";

export default function SideCart({ products }: { products: Product[] | null }) {
  const { items, count, total, open, setOpen, removeItem, updateQty } = useCart();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleDialogKeyDown);
    return () => {
      document.removeEventListener("keydown", handleDialogKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [open, setOpen]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-brown/40 z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-cream z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="side-cart-title"
        aria-hidden={!open}
        inert={!open}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brown/10">
          <div>
            <p id="side-cart-title" className="text-xs tracking-widest uppercase text-warm-gray">
              Mon panier
            </p>
            <p className="text-sm font-bold text-brown">
              {count} article{count !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-brown/50 hover:text-brown transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown"
            aria-label="Fermer le panier"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 space-y-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <p className="text-warm-gray text-sm tracking-wider">
                Votre panier est vide
              </p>
              <button
                onClick={() => setOpen(false)}
                className="text-xs tracking-widest uppercase underline text-brown"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            items.map((item) => {
              const variations = Array.isArray(item.product.variations) ? item.product.variations : [];
              const variationLabel = variations[item.variationIndex]?.label;
              return (
                <div key={item.id} className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 bg-cream-dark shrink-0 relative overflow-hidden">
                    {item.product.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brown/5 to-gold/15" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium tracking-wider text-brown uppercase truncate">
                      {item.product.name}
                    </p>
                    {variationLabel && (
                      <p className="text-[11px] text-warm-gray mt-0.5">{variationLabel}</p>
                    )}
                    {item.tranche && (
                      <p className="text-[11px] text-warm-gray">Tranché</p>
                    )}
                    <p className="text-xs font-bold text-brown mt-1">
                      {(item.unitPrice * item.quantity).toFixed(2).replace(".", ",")} €
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-0 mt-2">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-7 h-7 border border-brown/20 text-brown hover:bg-brown/5 transition-colors text-sm"
                        aria-label={`Diminuer la quantité de ${item.product.name}`}
                      >
                        −
                      </button>
                      <span className="w-8 h-7 border-t border-b border-brown/20 flex items-center justify-center text-xs font-bold text-brown">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-7 h-7 border border-brown/20 text-brown hover:bg-brown/5 transition-colors text-sm"
                        aria-label={`Augmenter la quantité de ${item.product.name}`}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-3 text-[11px] text-warm-gray hover:text-red-500 transition-colors tracking-wider"
                        aria-label={`Supprimer ${item.product.name} du panier`}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {items.length > 0 && <CartRecommendations products={products} />}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-brown/10 bg-cream px-4 sm:px-6 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs tracking-widest uppercase text-warm-gray">Total</span>
              <span className="text-lg font-bold text-brown">
                {total.toFixed(2).replace(".", ",")} €
              </span>
            </div>
            <p className="text-[11px] text-warm-gray tracking-wider">
              Commandez avant 17h — retrait le lendemain dès 7h
            </p>
            <Link
              href="/click-and-collect"
              onClick={() => setOpen(false)}
              className="block w-full bg-brown text-cream text-center py-3.5 text-xs tracking-widest uppercase font-medium hover:bg-brown-light transition-colors"
            >
              Commander — Click &amp; Collect
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="block w-full text-center text-xs tracking-widest uppercase text-brown/50 hover:text-brown transition-colors py-1"
            >
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </>
  );
}
