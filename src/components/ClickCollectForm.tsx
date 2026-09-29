"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { getPickupDates, PICKUP_TIMES } from "@/lib/pickup";
import type { Product, OrderItem } from "@/types";

const formatPrice = (n: number) => n.toFixed(2).replace(".", ",");

export default function ClickCollectForm({ products }: { products: Product[] }) {
  const { items, count, total, addItem, updateQty, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pickupDates = useMemo(() => getPickupDates(), []);

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    pickup_date: "",
    pickup_time: "08:00",
    notes: "",
  });

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const pickupLabel = pickupDates.find((d) => d.value === form.pickup_date)?.label ?? form.pickup_date;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError(null);

    const orderItems: OrderItem[] = items.map((i) => ({
      product_id: i.product.id,
      product_name: i.product.name,
      quantity: i.quantity,
      unit_price: i.unitPrice,
    }));

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, items: orderItems, total_amount: total }),
    });

    setSubmitting(false);
    if (res.ok) {
      clear();
      setSuccess(true);
      setDrawerOpen(false);
      window.scrollTo({ top: 0 });
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Une erreur est survenue. Merci de réessayer.");
    }
  };

  if (success) {
    return (
      <div className="text-center py-24">
        <div className="w-12 h-12 border-2 border-brown flex items-center justify-center mx-auto mb-6 text-xl">
          ✓
        </div>
        <h2 className="text-2xl font-bold tracking-widest uppercase text-brown mb-3">
          Commande confirmée
        </h2>
        <p className="text-sm text-warm-gray tracking-wider mb-1">
          Merci {form.customer_name}. Nous vous confirmons votre commande par email.
        </p>
        <p className="text-sm text-warm-gray tracking-wider">
          Retrait le {pickupLabel} à {form.pickup_time} en boutique.
        </p>
      </div>
    );
  }

  // text-base sur mobile : en dessous de 16px, iOS zoome automatiquement sur le champ
  const inputClass =
    "w-full bg-cream/10 border border-cream/20 px-3 py-3 lg:py-2.5 text-base lg:text-xs text-cream placeholder-cream/40 focus:outline-none focus:border-gold";
  const fieldLabel = "block text-[10px] tracking-widest uppercase text-cream/60 mb-1.5";

  // Appelé comme fonction (pas <Composant />) pour ne pas remonter les champs à chaque frappe
  const renderOrderPanel = (idPrefix: string) => (
    <div className="bg-brown text-cream p-6 h-full flex flex-col">
      <h2 className="text-xs font-bold tracking-widest uppercase mb-1 text-gold">
        Votre commande
      </h2>
      <p className="text-xs text-cream/40 tracking-wider mb-4">
        {count} article{count !== 1 ? "s" : ""}
      </p>

      {items.length === 0 ? (
        <p className="text-xs text-cream/50 tracking-wider py-4 border-t border-cream/10">
          Aucun article sélectionné
        </p>
      ) : (
        <div className="border-t border-cream/10 pt-4 space-y-3 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-xs gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-cream/80 truncate">{item.product.name}</p>
                {item.tranche && <p className="text-cream/40 text-[10px]">Tranché</p>}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => updateQty(item.id, item.quantity - 1)}
                  className="w-7 h-7 lg:w-5 lg:h-5 border border-cream/20 text-cream/60 hover:text-cream hover:border-cream/40 transition-colors flex items-center justify-center text-xs"
                  aria-label={`Retirer un ${item.product.name}`}
                >
                  −
                </button>
                <span className="text-cream font-bold w-5 text-center">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                  className="w-7 h-7 lg:w-5 lg:h-5 border border-cream/20 text-cream/60 hover:text-cream hover:border-cream/40 transition-colors flex items-center justify-center text-xs"
                  aria-label={`Ajouter un ${item.product.name}`}
                >
                  +
                </button>
                <span className="text-cream/60 w-14 text-right">
                  {formatPrice(item.unitPrice * item.quantity)}€
                </span>
              </div>
            </div>
          ))}
          <div className="border-t border-cream/10 pt-3 flex justify-between font-bold text-sm">
            <span>Total</span>
            <span>{formatPrice(total)} €</span>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <p className="text-[11px] tracking-widest uppercase text-gold">1. Vos coordonnées</p>
          <input required type="text" placeholder="Nom complet" autoComplete="name"
            value={form.customer_name}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
            className={inputClass} />
          <input required type="email" placeholder="Email" autoComplete="email"
            value={form.customer_email}
            onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
            className={inputClass} />

          <p className="text-[11px] tracking-widest uppercase text-gold pt-2">2. Retrait en boutique</p>
          <div>
            <label htmlFor={`${idPrefix}-pickup_date`} className={fieldLabel}>Jour de retrait</label>
            <select id={`${idPrefix}-pickup_date`} required
              value={form.pickup_date}
              onChange={(e) => setForm({ ...form, pickup_date: e.target.value })}
              className={`${inputClass} ${form.pickup_date ? "" : "text-cream/50"}`}>
              <option value="" disabled>Choisissez un jour</option>
              {pickupDates.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${idPrefix}-pickup_time`} className={fieldLabel}>Heure de retrait</label>
            <select id={`${idPrefix}-pickup_time`}
              value={form.pickup_time}
              onChange={(e) => setForm({ ...form, pickup_time: e.target.value })}
              className={inputClass}>
              {PICKUP_TIMES.map((t) => <option key={t} value={t}>{t.replace(":", "h")}</option>)}
            </select>
          </div>
          <p className="text-[10px] text-cream/40 leading-relaxed">
            Commande avant 17h pour un retrait dès le lendemain. Fermé le dimanche.
          </p>
          <textarea placeholder="Notes (optionnel)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
            className={`${inputClass} resize-none`} />
          {error && (
            <p role="alert" className="text-xs text-red-200 bg-red-900/30 border border-red-300/30 px-3 py-2">
              {error}
            </p>
          )}
          <button type="submit" disabled={submitting}
            className="w-full bg-gold text-brown py-4 lg:py-3 text-xs tracking-widest uppercase font-bold hover:bg-gold/90 transition-colors disabled:opacity-50 mt-2">
            {submitting ? "Envoi..." : "Confirmer la commande"}
          </button>
        </form>
      )}
    </div>
  );

  return (
    <>
      {/* Rappel mobile en haut de page */}
      {count > 0 && (
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="lg:hidden w-full mb-8 bg-brown text-cream p-5 text-left flex items-center justify-between gap-4"
        >
          <span>
            <span className="block text-[10px] tracking-widest uppercase text-gold font-bold mb-1">
              Votre panier est prêt
            </span>
            <span className="block text-sm font-bold">
              {count} article{count !== 1 ? "s" : ""} · {formatPrice(total)} €
            </span>
            <span className="block text-xs text-cream/60 mt-1">
              Choisissez votre créneau de retrait pour valider.
            </span>
          </span>
          <span className="shrink-0 bg-gold text-brown text-[10px] font-bold tracking-widest uppercase px-4 py-3">
            Finaliser
          </span>
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Produits */}
        <div className="lg:col-span-2 pb-40 lg:pb-0">
          <div className="mb-6">
            <h2 className="text-xs font-bold tracking-widest uppercase text-brown mb-1">
              Vous aimerez aussi
            </h2>
            <p className="text-xs text-warm-gray tracking-wide">
              Complétez votre commande avec d&apos;autres articles de la boulangerie.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => {
              const cartItem = items.find((i) => i.product.id === product.id);
              return (
                <div key={product.id} className="border border-brown/10 p-4 bg-cream-dark">
                  <div className="aspect-square bg-brown/5 mb-3 relative overflow-hidden">
                    {product.image_url ? (
                      <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brown/5 to-gold/10" />
                    )}
                  </div>
                  <p className="text-xs font-medium tracking-wider text-brown mb-0.5 uppercase truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-warm-gray mb-3">
                    {formatPrice(product.price)} €
                  </p>
                  <div className="flex items-center gap-1">
                    {cartItem ? (
                      <>
                        <button
                          onClick={() => updateQty(cartItem.id, cartItem.quantity - 1)}
                          className="w-7 h-7 border border-brown/30 text-brown flex items-center justify-center hover:bg-brown hover:text-cream hover:border-brown transition-colors"
                        >
                          −
                        </button>
                        <span className="text-sm font-bold w-6 text-center text-brown">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => addItem(product)}
                          className="w-7 h-7 border border-brown/30 text-brown flex items-center justify-center hover:bg-brown hover:text-cream hover:border-brown transition-colors"
                        >
                          +
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => addItem(product)}
                        className="btn-outline text-xs w-full py-1.5"
                      >
                        Ajouter
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Colonne droite — desktop uniquement */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-[112px]">{renderOrderPanel("desktop")}</div>
        </div>
      </div>

      {/* ── BARRE STICKY MOBILE ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-brown px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.25)]">
        <p className="text-[11px] text-cream/70 text-center mb-2">
          {count > 0
            ? "Dernière étape : vos coordonnées et votre créneau de retrait"
            : "Ajoutez des produits pour passer commande"}
        </p>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          disabled={count === 0}
          className="w-full flex items-center justify-between gap-3 bg-gold text-brown px-5 py-4 text-xs font-bold tracking-widest uppercase disabled:opacity-40"
        >
          <span>Finaliser ma commande</span>
          <span className="flex items-center gap-2 shrink-0">
            {formatPrice(total)} €
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </span>
        </button>
      </div>

      {/* ── DRAWER MOBILE ── */}
      {drawerOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 max-h-[90svh] overflow-y-auto overscroll-contain rounded-t-2xl shadow-2xl">
            <div className="bg-brown sticky top-0 z-10 flex items-center justify-between px-5 pt-5 pb-3 border-b border-cream/10">
              <div className="w-10 h-1 bg-cream/30 rounded-full absolute left-1/2 -translate-x-1/2 top-2" />
              <p className="text-xs font-bold tracking-widest uppercase text-gold">Finaliser ma commande</p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="text-cream/60 hover:text-cream transition-colors text-lg leading-none p-1"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
            <div className="pb-[env(safe-area-inset-bottom)] bg-brown">{renderOrderPanel("mobile")}</div>
          </div>
        </>
      )}
    </>
  );
}
