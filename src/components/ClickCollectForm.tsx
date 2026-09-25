"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import type { Product, OrderItem } from "@/types";

const PICKUP_TIMES = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00",
  "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00",
];

export default function ClickCollectForm({ products }: { products: Product[] }) {
  const { items, count, total, addItem, updateQty, removeItem, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    pickup_date: "",
    pickup_time: "08:00",
    notes: "",
  });

  // Bloquer le scroll body quand le drawer est ouvert
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);

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
          Retrait le {form.pickup_date} à {form.pickup_time} en boutique.
        </p>
      </div>
    );
  }

  const inputClass = "w-full bg-cream/10 border border-cream/20 px-3 py-2.5 text-xs text-cream placeholder-cream/40 focus:outline-none focus:border-gold";

  // Contenu partagé du récapitulatif + formulaire
  const OrderPanel = () => (
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
        <div className="border-t border-cream/10 pt-4 space-y-2.5 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-start text-xs gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-cream/80 truncate">{item.product.name}</p>
                {item.tranche && <p className="text-cream/40 text-[10px]">Tranché</p>}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => updateQty(item.id, item.quantity - 1)}
                  className="w-5 h-5 border border-cream/20 text-cream/60 hover:text-cream hover:border-cream/40 transition-colors flex items-center justify-center text-xs"
                >
                  −
                </button>
                <span className="text-cream font-bold w-4 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                  className="w-5 h-5 border border-cream/20 text-cream/60 hover:text-cream hover:border-cream/40 transition-colors flex items-center justify-center text-xs"
                >
                  +
                </button>
                <span className="text-cream/60 w-12 text-right">
                  {(item.unitPrice * item.quantity).toFixed(2).replace(".", ",")}€
                </span>
              </div>
            </div>
          ))}
          <div className="border-t border-cream/10 pt-3 flex justify-between font-bold text-sm">
            <span>Total</span>
            <span>{total.toFixed(2).replace(".", ",")} €</span>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <form onSubmit={handleSubmit} className="space-y-2.5 mt-2">
          <p className="text-[11px] tracking-widest uppercase text-gold mb-3">
            1. Vos coordonnées
          </p>
          <input required type="text" placeholder="Nom complet"
            value={form.customer_name}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
            className={inputClass} />
          <input required type="email" placeholder="Email"
            value={form.customer_email}
            onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
            className={inputClass} />

          <p className="text-[11px] tracking-widets uppercase text-gold pt-1">
            2. Retrait
          </p>
          <input required type="date"
            value={form.pickup_date}
            onChange={(e) => setForm({ ...form, pickup_date: e.target.value })}
            min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
            className={inputClass} />
          <select value={form.pickup_time}
            onChange={(e) => setForm({ ...form, pickup_time: e.target.value })}
            className={inputClass}>
            {PICKUP_TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <textarea placeholder="Notes (optionnel)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
            className={`${inputClass} resize-none`} />
          <button type="submit" disabled={submitting}
            className="w-full bg-gold text-brown py-3 text-xs tracking-widest uppercase font-bold hover:bg-gold/90 transition-colors disabled:opacity-50 mt-2">
            {submitting ? "Envoi..." : "Confirmer la commande"}
          </button>
        </form>
      )}
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Produits */}
        <div className="lg:col-span-2 pb-24 lg:pb-0">
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
                    {product.price.toFixed(2).replace(".", ",")} €
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
          <div className="sticky top-[112px]">
            <OrderPanel />
          </div>
        </div>
      </div>

      {/* ── BARRE STICKY MOBILE ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-brown border-t border-cream/10 px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-gold font-bold">
            Votre commande
          </p>
          <p className="text-xs text-cream font-bold">
            {count} article{count !== 1 ? "s" : ""} · {total.toFixed(2).replace(".", ",")} €
          </p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 bg-gold text-brown px-4 py-2.5 text-[11px] font-bold tracking-widest uppercase shrink-0"
        >
          Commander
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>

      {/* ── DRAWER MOBILE ── */}
      {drawerOpen && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Panel */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl shadow-2xl">
            {/* Handle + fermer */}
            <div className="bg-brown sticky top-0 flex items-center justify-between px-5 pt-4 pb-3 border-b border-cream/10">
              <div className="w-10 h-1 bg-cream/30 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
              <p className="text-xs font-bold tracking-widest uppercase text-gold pt-1">Commander</p>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-cream/60 hover:text-cream transition-colors text-lg leading-none pt-1"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
            <OrderPanel />
          </div>
        </>
      )}
    </>
  );
}
