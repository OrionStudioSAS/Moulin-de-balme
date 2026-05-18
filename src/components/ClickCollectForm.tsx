"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product, OrderItem } from "@/types";

const PICKUP_TIMES = ["07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00"];

type CartItem = { product: Product; quantity: number };

export default function ClickCollectForm({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    pickup_date: "",
    pickup_time: "08:00",
    notes: "",
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === productId);
      if (existing && existing.quantity > 1) return prev.map((i) => i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i);
      return prev.filter((i) => i.product.id !== productId);
    });
  };

  const total = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setSubmitting(true);
    const supabase = createClient();

    const items: OrderItem[] = cart.map((i) => ({
      product_id: i.product.id,
      product_name: i.product.name,
      quantity: i.quantity,
      unit_price: i.product.price,
    }));

    const { error } = await supabase.from("orders").insert({
      ...form,
      items,
      total_amount: total,
      status: "pending",
    });

    setSubmitting(false);
    if (!error) setSuccess(true);
  };

  if (success) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">✓</p>
        <h2 className="text-xl font-bold tracking-widest uppercase text-brown mb-3">
          Commande confirmée
        </h2>
        <p className="text-sm text-warm-gray tracking-wider mb-2">
          Merci {form.customer_name}. Nous vous confirmons votre commande par email.
        </p>
        <p className="text-sm text-warm-gray tracking-wider">
          Retrait le {form.pickup_date} à {form.pickup_time} en boutique.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Products */}
      <div className="lg:col-span-2">
        <h2 className="text-sm font-bold tracking-widest uppercase text-brown mb-6">
          1. Choisir vos produits
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => {
            const cartItem = cart.find((i) => i.product.id === product.id);
            return (
              <div key={product.id} className="border border-brown/10 p-4 bg-cream-dark">
                <div className="aspect-square bg-brown/5 mb-3" />
                <p className="text-xs font-medium tracking-wider text-brown mb-1">{product.name}</p>
                <p className="text-xs text-warm-gray mb-3">{product.price.toFixed(2)} €</p>
                <div className="flex items-center gap-2">
                  {cartItem ? (
                    <>
                      <button onClick={() => removeFromCart(product.id)} className="w-7 h-7 border border-brown text-brown text-lg leading-none flex items-center justify-center hover:bg-brown hover:text-cream transition-colors">−</button>
                      <span className="text-sm font-bold w-4 text-center">{cartItem.quantity}</span>
                      <button onClick={() => addToCart(product)} className="w-7 h-7 border border-brown text-brown text-lg leading-none flex items-center justify-center hover:bg-brown hover:text-cream transition-colors">+</button>
                    </>
                  ) : (
                    <button onClick={() => addToCart(product)} className="btn-outline text-xs w-full py-2 px-3">
                      Ajouter
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order summary + form */}
      <div className="lg:col-span-1">
        <div className="bg-brown text-cream p-6 sticky top-24">
          <h2 className="text-xs font-bold tracking-widests uppercase mb-4 text-gold">
            Votre commande
          </h2>

          {cart.length === 0 ? (
            <p className="text-xs text-cream/50 tracking-wider py-4">
              Aucun article sélectionné
            </p>
          ) : (
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-xs">
                  <span className="text-cream/80">{item.product.name} ×{item.quantity}</span>
                  <span>{(item.product.price * item.quantity).toFixed(2)} €</span>
                </div>
              ))}
              <div className="border-t border-cream/20 pt-3 flex justify-between text-sm font-bold">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>
          )}

          {cart.length > 0 && (
            <form onSubmit={handleSubmit} className="space-y-3 mt-4">
              <input
                required
                type="text"
                placeholder="Nom complet"
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                className="w-full bg-cream/10 border border-cream/20 px-3 py-2 text-xs text-cream placeholder-cream/40 focus:outline-none focus:border-gold"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.customer_email}
                onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                className="w-full bg-cream/10 border border-cream/20 px-3 py-2 text-xs text-cream placeholder-cream/40 focus:outline-none focus:border-gold"
              />
              <input
                required
                type="tel"
                placeholder="Téléphone"
                value={form.customer_phone}
                onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                className="w-full bg-cream/10 border border-cream/20 px-3 py-2 text-xs text-cream placeholder-cream/40 focus:outline-none focus:border-gold"
              />
              <input
                required
                type="date"
                value={form.pickup_date}
                onChange={(e) => setForm({ ...form, pickup_date: e.target.value })}
                min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                className="w-full bg-cream/10 border border-cream/20 px-3 py-2 text-xs text-cream focus:outline-none focus:border-gold"
              />
              <select
                value={form.pickup_time}
                onChange={(e) => setForm({ ...form, pickup_time: e.target.value })}
                className="w-full bg-cream/10 border border-cream/20 px-3 py-2 text-xs text-cream focus:outline-none focus:border-gold"
              >
                {PICKUP_TIMES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <textarea
                placeholder="Notes (optionnel)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="w-full bg-cream/10 border border-cream/20 px-3 py-2 text-xs text-cream placeholder-cream/40 focus:outline-none focus:border-gold resize-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full bg-gold text-brown hover:bg-gold/90 disabled:opacity-50"
              >
                {submitting ? "Envoi..." : "Confirmer la commande"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
