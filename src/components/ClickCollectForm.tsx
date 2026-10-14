"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { getPickupDates, pickupTimesFor } from "@/lib/pickup";
import type { OrderItem } from "@/types";

const formatPrice = (n: number) => n.toFixed(2).replace(".", ",");

const jourCourt = new Intl.DateTimeFormat("fr-FR", { weekday: "short", timeZone: "UTC" });
const moisCourt = new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: "UTC" });
const partiesDate = (value: string) => {
  const d = new Date(`${value}T00:00:00Z`);
  return { jour: jourCourt.format(d).replace(".", ""), num: d.getUTCDate(), mois: moisCourt.format(d).replace(".", "") };
};

function Etape({ n, titre, children }: { n: number; titre: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-brown/10 p-5 md:p-7">
      <h2 className="flex items-center gap-3 mb-5">
        <span className="w-7 h-7 rounded-full bg-brown text-cream text-xs font-bold flex items-center justify-center shrink-0">{n}</span>
        <span className="text-xs font-bold tracking-widest uppercase text-brown">{titre}</span>
      </h2>
      {children}
    </section>
  );
}

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
    pickup_time: "",
    notes: "",
  });

  const pickupLabel = pickupDates.find((d) => d.value === form.pickup_date)?.label ?? form.pickup_date;
  const times = pickupTimesFor(form.pickup_date);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!form.pickup_date || !form.pickup_time) {
      setError(form.pickup_date ? "Choisissez une heure de retrait." : "Choisissez un jour de retrait.");
      document.getElementById("retrait")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
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
      <div className="max-w-lg mx-auto bg-white border border-brown/10 text-center px-6 py-14">
        <div className="w-14 h-14 rounded-full bg-gold/20 text-brown flex items-center justify-center mx-auto mb-6">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold tracking-widest uppercase text-brown mb-3">Commande confirmée</h2>
        <p className="text-sm text-warm-gray mb-1">Merci {form.customer_name}, un e-mail de confirmation vous a été envoyé.</p>
        <p className="text-sm text-brown font-medium">
          Retrait le {pickupLabel} à {form.pickup_time.replace(":", "h")} en boutique.
        </p>
        <Link href="/" className="btn-outline inline-block mt-8">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

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

  // text-base sur mobile : en dessous de 16px, iOS zoome automatiquement sur le champ
  const inputClass =
    "w-full bg-cream/50 border border-brown/15 px-4 py-3 text-base md:text-sm text-brown placeholder-warm-gray/70 focus:outline-none focus:border-brown focus:bg-white transition-colors";
  const fieldLabel = "block text-[11px] tracking-widest uppercase text-warm-gray mb-2";
  const chip = (actif: boolean) =>
    `border transition-colors ${actif ? "bg-brown border-brown text-cream" : "bg-white border-brown/15 text-brown hover:border-brown/50"}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-10 items-start">
      {/* Récapitulatif — en premier sur mobile, à droite sur ordinateur */}
      <aside className="lg:order-2 lg:sticky lg:top-[112px] bg-white border border-brown/10">
        <div className="px-5 md:px-6 pt-5 pb-4 flex items-baseline justify-between border-b border-brown/10">
          <h2 className="text-xs font-bold tracking-widest uppercase text-brown">Votre panier</h2>
          <span className="text-xs text-warm-gray">
            {count} article{count !== 1 ? "s" : ""}
          </span>
        </div>
        <ul className="divide-y divide-brown/10 px-5 md:px-6">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-4">
              <div className="relative w-14 h-14 shrink-0 bg-cream overflow-hidden">
                {item.product.image_url && <Image src={item.product.image_url} alt="" fill sizes="56px" className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-brown truncate">{item.product.name}</p>
                {item.tranche && <p className="text-[11px] text-warm-gray">Tranché</p>}
                <div className="mt-1.5 inline-flex items-center border border-brown/15">
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    className="w-8 h-8 md:w-7 md:h-7 text-brown/70 hover:text-brown hover:bg-cream transition-colors"
                    aria-label={`Retirer un ${item.product.name}`}
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-sm font-bold text-brown">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="w-8 h-8 md:w-7 md:h-7 text-brown/70 hover:text-brown hover:bg-cream transition-colors"
                    aria-label={`Ajouter un ${item.product.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
              <span className="text-sm text-brown shrink-0">{formatPrice(item.unitPrice * item.quantity)} €</span>
            </li>
          ))}
        </ul>
        <div className="mx-5 md:mx-6 py-4 border-t border-brown/10 flex justify-between items-baseline">
          <span className="text-xs font-bold tracking-widest uppercase text-brown">Total</span>
          <span className="text-xl font-bold text-brown">{formatPrice(total)} €</span>
        </div>
        <div className="bg-cream/60 px-5 md:px-6 py-4 text-xs text-warm-gray leading-relaxed">
          Paiement en boutique au moment du retrait.
          <br />7 avenue Alsace-Lorraine, Brive-la-Gaillarde.
          <Link href="/produits" className="block mt-2 text-brown underline underline-offset-4 hover:text-brown-light">
            Ajouter d&apos;autres produits
          </Link>
        </div>
      </aside>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="lg:order-1 space-y-4 md:space-y-5">
        <Etape n={1} titre="Vos coordonnées">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cc-name" className={fieldLabel}>Nom complet</label>
              <input id="cc-name" required type="text" autoComplete="name" placeholder="Marie Dupont"
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                className={inputClass} />
            </div>
            <div>
              <label htmlFor="cc-email" className={fieldLabel}>E-mail</label>
              <input id="cc-email" required type="email" autoComplete="email" placeholder="marie@exemple.fr"
                value={form.customer_email}
                onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                className={inputClass} />
            </div>
          </div>
          <p className="text-[11px] text-warm-gray mt-3">La confirmation de commande vous est envoyée à cette adresse.</p>
        </Etape>

        <div id="retrait" className="scroll-mt-28">
          <Etape n={2} titre="Retrait en boutique">
            <p className={fieldLabel}>Jour</p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="radiogroup" aria-label="Jour de retrait">
              {pickupDates.map((d) => {
                const { jour, num, mois } = partiesDate(d.value);
                const actif = form.pickup_date === d.value;
                return (
                  <button
                    key={d.value}
                    type="button"
                    role="radio"
                    aria-checked={actif}
                    aria-label={d.label}
                    onClick={() => {
                      const t = pickupTimesFor(d.value);
                      setError(null);
                      setForm({ ...form, pickup_date: d.value, pickup_time: t.includes(form.pickup_time) ? form.pickup_time : "" });
                    }}
                    className={`${chip(actif)} snap-start shrink-0 w-[68px] py-2.5 flex flex-col items-center`}
                  >
                    <span className={`text-[10px] uppercase tracking-widest ${actif ? "text-cream/70" : "text-warm-gray"}`}>{jour}</span>
                    <span className="text-lg font-bold leading-tight">{num}</span>
                    <span className={`text-[10px] uppercase tracking-widest ${actif ? "text-cream/70" : "text-warm-gray"}`}>{mois}</span>
                  </button>
                );
              })}
            </div>

            <p className={`${fieldLabel} mt-5`}>Heure</p>
            {form.pickup_date ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2" role="radiogroup" aria-label="Heure de retrait">
                {times.map((t) => {
                  const actif = form.pickup_time === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      role="radio"
                      aria-checked={actif}
                      onClick={() => {
                        setError(null);
                        setForm({ ...form, pickup_time: t });
                      }}
                      className={`${chip(actif)} py-2.5 text-sm`}
                    >
                      {t.replace(":", "h")}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-warm-gray bg-cream/50 border border-dashed border-brown/15 px-4 py-3">
                Choisissez d&apos;abord un jour.
              </p>
            )}
            <p className="text-[11px] text-warm-gray mt-4">
              Commande avant 14h pour un retrait dès le lendemain. Samedi jusqu&apos;à 12h30, fermé le dimanche.
            </p>
          </Etape>
        </div>

        <Etape n={3} titre="Un mot pour nous ?">
          <label htmlFor="cc-notes" className="sr-only">Notes</label>
          <textarea id="cc-notes" placeholder="Allergies, demande particulière… (facultatif)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
            className={`${inputClass} resize-none`} />
        </Etape>

        {error && (
          <p role="alert" className="text-sm text-red-800 bg-red-50 border border-red-200 px-4 py-3">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting}
          className="w-full bg-brown text-cream py-4 px-6 text-xs tracking-widest uppercase font-bold hover:bg-brown-light transition-colors disabled:opacity-50 flex items-center justify-between gap-4">
          <span>{submitting ? "Envoi en cours…" : "Confirmer la commande"}</span>
          <span className="text-gold text-sm">{formatPrice(total)} €</span>
        </button>
      </form>
    </div>
  );
}
