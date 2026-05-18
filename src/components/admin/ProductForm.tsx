"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Product, Category } from "@/types";

const DAYS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "0",
    category_id: product?.category_id ?? "",
    available_days: product?.available_days ?? [],
    is_available: product?.is_available ?? true,
    is_featured: product?.is_featured ?? false,
    sort_order: product?.sort_order?.toString() ?? "0",
  });

  const toggleDay = (day: string) => {
    setForm((prev) => ({
      ...prev,
      available_days: prev.available_days.includes(day)
        ? prev.available_days.filter((d) => d !== day)
        : [...prev.available_days, day],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const payload = {
      ...form,
      price: parseFloat(form.price),
      sort_order: parseInt(form.sort_order),
      category_id: form.category_id || null,
    };

    const { error: err } = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    router.push("/admin/produits");
    router.refresh();
  };

  const inputClass = "w-full border border-brown/30 px-3 py-2 text-sm text-brown bg-white focus:outline-none focus:border-brown";
  const labelClass = "block text-xs tracking-widests uppercase text-warm-gray mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Nom *</label>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Slug *</label>
        <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} className={inputClass} />
        <p className="text-xs text-warm-gray mt-1">URL : /produits/{form.slug}</p>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Prix (€) *</label>
          <input required type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Ordre d'affichage</label>
          <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Catégorie</label>
        <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className={inputClass}>
          <option value="">— Sans catégorie —</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Jours de disponibilité</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {DAYS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`text-xs tracking-wider px-3 py-1 border transition-colors capitalize ${
                form.available_days.includes(day)
                  ? "border-brown bg-brown text-cream"
                  : "border-brown/30 text-brown/60 hover:border-brown"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} className="w-4 h-4" />
          <span className="text-xs tracking-widests uppercase text-brown">Disponible</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4" />
          <span className="text-xs tracking-widests uppercase text-brown">Mis en avant</span>
        </label>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex gap-4 pt-2">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
          {loading ? "Enregistrement..." : product ? "Mettre à jour" : "Créer le produit"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">
          Annuler
        </button>
      </div>
    </form>
  );
}
