"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Product, Category, Subcategory } from "@/types";

const DAYS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const BADGES = [
  { value: "", label: "Aucun" },
  { value: "nouveau", label: "Nouveau" },
  { value: "bestseller", label: "Bestseller" },
  { value: "exclusif", label: "Exclusif" },
];

export default function ProductForm({
  categories,
  subcategories,
  product,
}: {
  categories: Category[];
  subcategories: Subcategory[];
  product?: Product;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url ?? null);

  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    subtitle: product?.subtitle ?? "",
    price: product?.price?.toString() ?? "0",
    category_id: product?.category_id ?? "",
    available_days: product?.available_days ?? [],
    is_available: product?.is_available ?? true,
    is_featured: product?.is_featured ?? false,
    badge: product?.badge ?? "",
    ingredients: product?.ingredients ?? "",
    conservation: product?.conservation ?? "",
    savoir_faire: product?.savoir_faire ?? "",
    le_saviez_vous: product?.le_saviez_vous ?? "",
    sort_order: product?.sort_order?.toString() ?? "0",
    image_url: product?.image_url ?? "",
    subcategory_id: product?.subcategory_id ?? "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error: uploadError } = await supabase.storage
      .from("products")
      .upload(filename, file, { upsert: false });

    if (uploadError) {
      setError(`Erreur upload : ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(data.path);
    setForm((prev) => ({ ...prev, image_url: publicUrl }));
    setImagePreview(publicUrl);
    setUploading(false);
  };

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
      subcategory_id: form.subcategory_id || null,
      badge: form.badge || null,
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
  const labelClass = "block text-xs tracking-widest uppercase text-warm-gray mb-1";
  const textareaClass = `${inputClass} resize-none`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image upload */}
      <div>
        <label className={labelClass}>Image du produit</label>
        <div className="flex gap-4 items-start">
          {/* Preview */}
          <div
            className="w-28 h-28 bg-cream-dark border border-brown/20 relative overflow-hidden shrink-0 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <Image src={imagePreview} alt="Aperçu" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                <span className="text-2xl text-brown/20">+</span>
                <span className="text-[10px] text-warm-gray tracking-wider">Image</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-outline text-xs py-2 px-4 disabled:opacity-50"
            >
              {uploading ? "Upload en cours..." : "Choisir une image"}
            </button>
            <p className="text-[11px] text-warm-gray mt-2 tracking-wider">
              JPG, PNG, WebP — max 5 Mo
            </p>
            {form.image_url && (
              <button
                type="button"
                onClick={() => { setForm((p) => ({ ...p, image_url: "" })); setImagePreview(null); }}
                className="text-[11px] text-red-500 hover:text-red-700 mt-1 tracking-wider"
              >
                Supprimer l'image
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nom *</label>
          <input required value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              const slug = name
                .toLowerCase()
                .normalize("NFD").replace(/[̀-ͯ]/g, "")
                .replace(/[^a-z0-9\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-");
              setForm({ ...form, name, slug });
            }}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Slug</label>
          <input value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
            className={`${inputClass} text-warm-gray`}
            placeholder="généré automatiquement" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Sous-titre (italique sous le nom)</label>
        <input value={form.subtitle}
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          className={inputClass} placeholder="Un grain ancien, une mie tendre..." />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea rows={3} value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={textareaClass} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Prix (€) *</label>
          <input required type="number" step="0.01" min="0" value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Badge</label>
          <select value={form.badge}
            onChange={(e) => setForm({ ...form, badge: e.target.value })}
            className={inputClass}>
            {BADGES.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Ordre</label>
          <input type="number" value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
            className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Catégorie</label>
          <select value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value, subcategory_id: "" })}
            className={inputClass}>
            <option value="">— Sans catégorie —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Sous-catégorie</label>
          <select value={form.subcategory_id}
            onChange={(e) => setForm({ ...form, subcategory_id: e.target.value })}
            className={inputClass}
            disabled={!form.category_id}>
            <option value="">— Aucune —</option>
            {subcategories
              .filter((s) => s.category_id === form.category_id)
              .map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Jours de disponibilité</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {DAYS.map((day) => (
            <button key={day} type="button" onClick={() => toggleDay(day)}
              className={`text-xs tracking-wider px-3 py-1 border transition-colors capitalize ${
                form.available_days.includes(day)
                  ? "border-brown bg-brown text-cream"
                  : "border-brown/30 text-brown/60 hover:border-brown"
              }`}>
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion content */}
      <div className="border-t border-brown/10 pt-5 space-y-4">
        <p className="text-xs tracking-widest uppercase text-warm-gray font-medium">Contenus accordéons</p>
        {[
          { key: "ingredients", label: "Ingrédients et allergènes" },
          { key: "conservation", label: "Conservation et valeurs nutritionnelles" },
          { key: "savoir_faire", label: "Savoir-faire" },
          { key: "le_saviez_vous", label: "Le saviez-vous ?" },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className={labelClass}>{label}</label>
            <textarea rows={2}
              value={form[key as keyof typeof form] as string}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className={textareaClass} />
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_available}
            onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
            className="w-4 h-4" />
          <span className="text-xs tracking-widest uppercase text-brown">Disponible</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_featured}
            onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
            className="w-4 h-4" />
          <span className="text-xs tracking-widest uppercase text-brown">Mis en avant</span>
        </label>
      </div>

      {error && <p className="text-xs text-red-600 bg-red-50 p-3">{error}</p>}

      <div className="flex gap-4 pt-2">
        <button type="submit" disabled={loading || uploading}
          className="btn-primary disabled:opacity-50">
          {loading ? "Enregistrement..." : product ? "Mettre à jour" : "Créer le produit"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">
          Annuler
        </button>
      </div>
    </form>
  );
}
