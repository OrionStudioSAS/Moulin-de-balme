"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { getPickupDates, pickupTimesFor } from "@/lib/pickup";
import type { OrderItem } from "@/types";

const formatPrice = (n: number) => n.toFixed(2).replace(".", ",");

export default function ClickCollectForm() {
  const { items, count, total, hydrated, updateQty, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pickupDates = useMemo(() => getPickupDates(), []);

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    pickup_date: "",
    pickup_time: "08:00",
    notes: "",
  });

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
              onChange={(e) => {
                const times = pickupTimesFor(e.target.value);
                setForm({ ...form, pickup_date: e.target.value, pickup_time: times.includes(form.pickup_time) ? form.pickup_time : times[times.length - 1] });
              }}
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
              {pickupTimesFor(form.pickup_date).map((t) => <option key={t} value={t}>{t.replace(":", "h")}</option>)}
            </select>
          </div>
          <p className="text-[10px] text-cream/40 leading-relaxed">
            Commande avant 14h pour un retrait dès le lendemain. Samedi jusqu’à 12h, fermé le dimanche.
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

  // Panier lu depuis le navigateur : rien à afficher avant sa lecture
  if (!hydrated) return <div className="min-h-[50vh]" aria-busy="true" />;

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-warm-gray tracking-wider mb-6">Votre panier est vide.</p>
        <Link href="/produits" className="btn-primary inline-block">
          Voir nos produits
        </Link>
      </div>
    );
  }

  return <div className="max-w-xl mx-auto">{renderOrderPanel("commande")}</div>;
}
