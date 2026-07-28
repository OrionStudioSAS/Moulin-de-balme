"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category, Subcategory } from "@/types";

export default function CategoryForm({
  category,
  subcategories,
}: {
  category: Category;
  subcategories: Subcategory[];
}) {
  const router = useRouter();
  const gridImgRef = useRef<HTMLInputElement>(null);
  const bannerImgRef = useRef<HTMLInputElement>(null);

  const [gridImage, setGridImage] = useState<string | null>(category.image_url);
  const [bannerImage, setBannerImage] = useState<string | null>(category.banner_image_url);
  const [fields, setFields] = useState({
    banner_title: category.banner_title ?? "",
    banner_subtitle: category.banner_subtitle ?? "",
    banner_description: category.banner_description ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"grid" | "banner" | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sous-catégories
  const [subs, setSubs] = useState<Subcategory[]>(subcategories);
  const [newSubName, setNewSubName] = useState("");
  const [addingSubcat, setAddingSubcat] = useState(false);

  const uploadImage = async (
    file: File,
    target: "grid" | "banner"
  ) => {
    setUploading(target);
    setError(null);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const prefix = target === "grid" ? "categories" : "banners";
    const filename = `${prefix}/${category.slug}-${target}-${Date.now()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("products")
      .upload(filename, file, { upsert: true });

    if (uploadErr) { setError(uploadErr.message); setUploading(null); return; }

    const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(filename);

    const field = target === "grid" ? "image_url" : "banner_image_url";
    const { error: updateErr } = await supabase
      .from("categories")
      .update({ [field]: publicUrl })
      .eq("id", category.id);

    if (updateErr) { setError(updateErr.message); }
    else {
      if (target === "grid") setGridImage(publicUrl);
      else setBannerImage(publicUrl);
    }
    setUploading(null);
  };

  const saveTexts = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("categories")
      .update(fields)
      .eq("id", category.id);
    if (err) setError(err.message);
    else setSaved(true);
    setSaving(false);
  };

  const slugify = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const addSubcategory = async () => {
    if (!newSubName.trim()) return;
    setAddingSubcat(true);
    const supabase = createClient();
    const slug = slugify(newSubName);
    const { data, error: err } = await supabase
      .from("subcategories")
      .insert({ category_id: category.id, name: newSubName.trim(), slug, sort_order: subs.length })
      .select()
      .single();
    if (err) setError(err.message);
    else if (data) { setSubs((p) => [...p, data]); setNewSubName(""); }
    setAddingSubcat(false);
  };

  const removeSubcategory = async (id: string) => {
    const supabase = createClient();
    const { error: err } = await supabase.from("subcategories").delete().eq("id", id);
    if (!err) setSubs((p) => p.filter((s) => s.id !== id));
    else setError(err.message);
  };

  const inputClass = "w-full border border-brown/30 px-3 py-2 text-sm text-brown bg-white focus:outline-none focus:border-brown";
  const labelClass = "block text-xs tracking-widest uppercase text-warm-gray mb-1";

  return (
    <div className="bg-white border border-brown/10 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-brown/10 pb-4">
        <div className="w-2 h-8 bg-brown" />
        <div>
          <p className="font-bold text-brown tracking-wide">{category.name}</p>
          <p className="text-[11px] text-warm-gray">/{category.slug}</p>
        </div>
      </div>

      {/* Images */}
      <div className="grid grid-cols-2 gap-6">
        {/* Image grille homepage */}
        <div>
          <p className={labelClass}>Image grille (Nos produits)</p>
          <div
            className="relative aspect-[3/4] bg-brown/10 cursor-pointer overflow-hidden group border border-brown/10"
            onClick={() => gridImgRef.current?.click()}
          >
            {gridImage ? (
              <>
                <Image src={gridImage} alt="" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold tracking-widest uppercase">Changer</span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 group-hover:bg-brown/20 transition-colors">
                <span className="text-brown/30 text-3xl">+</span>
                <span className="text-brown/40 text-[10px] tracking-wider uppercase">Ajouter</span>
              </div>
            )}
            {uploading === "grid" && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <span className="text-brown text-xs">Upload...</span>
              </div>
            )}
          </div>
          <input ref={gridImgRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "grid")} />
        </div>

        {/* Image bannière page produits */}
        <div>
          <p className={labelClass}>Image bannière (page produits)</p>
          <div
            className="relative aspect-[3/4] bg-brown/10 cursor-pointer overflow-hidden group border border-brown/10"
            onClick={() => bannerImgRef.current?.click()}
          >
            {bannerImage ? (
              <>
                <Image src={bannerImage} alt="" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold tracking-widest uppercase">Changer</span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 group-hover:bg-brown/20 transition-colors">
                <span className="text-brown/30 text-3xl">+</span>
                <span className="text-brown/40 text-[10px] tracking-wider uppercase">Ajouter</span>
              </div>
            )}
            {uploading === "banner" && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <span className="text-brown text-xs">Upload...</span>
              </div>
            )}
          </div>
          <input ref={bannerImgRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "banner")} />
        </div>
      </div>

      {/* Textes bannière */}
      <div className="space-y-3">
        <p className={labelClass}>Textes de la bannière</p>
        <div>
          <label className={labelClass}>Titre</label>
          <input value={fields.banner_title}
            onChange={(e) => setFields((p) => ({ ...p, banner_title: e.target.value }))}
            placeholder={category.name}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Sous-titre</label>
          <input value={fields.banner_subtitle}
            onChange={(e) => setFields((p) => ({ ...p, banner_subtitle: e.target.value }))}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea rows={2} value={fields.banner_description}
            onChange={(e) => setFields((p) => ({ ...p, banner_description: e.target.value }))}
            className={`${inputClass} resize-none`} />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={saveTexts}
            disabled={saving}
            className="text-[10px] font-bold tracking-widest uppercase border border-brown text-brown px-5 py-2 hover:bg-brown hover:text-cream transition-colors disabled:opacity-40"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
          {saved && <span className="text-green-600 text-xs">Sauvegardé ✓</span>}
          {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
      </div>

      {/* Sous-catégories */}
      <div>
        <p className={`${labelClass} mb-3`}>Sous-catégories (filtres secondaires)</p>
        <div className="space-y-2 mb-3">
          {subs.length === 0 && (
            <p className="text-xs text-warm-gray italic">Aucune sous-catégorie</p>
          )}
          {subs.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between bg-cream px-3 py-2 border border-brown/10">
              <div>
                <span className="text-sm text-brown">{sub.name}</span>
                <span className="text-[11px] text-warm-gray ml-2">/{sub.slug}</span>
              </div>
              <button
                type="button"
                onClick={() => removeSubcategory(sub.id)}
                className="text-[10px] text-red-400 hover:text-red-600 tracking-widest uppercase transition-colors"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newSubName}
            onChange={(e) => setNewSubName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubcategory())}
            placeholder="Nom de la sous-catégorie..."
            className={`${inputClass} flex-1`}
          />
          <button
            type="button"
            onClick={addSubcategory}
            disabled={addingSubcat || !newSubName.trim()}
            className="text-[10px] font-bold tracking-widest uppercase border border-brown text-brown px-4 py-2 hover:bg-brown hover:text-cream transition-colors disabled:opacity-40 whitespace-nowrap"
          >
            {addingSubcat ? "..." : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}
