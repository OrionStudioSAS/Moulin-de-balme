"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type BannerData = {
  title?: string;
  subtitle?: string;
  description?: string;
  banner_image_url?: string | null;
};

export default function DefaultBannerForm({ defaultBanner }: { defaultBanner: BannerData }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fields, setFields] = useState({
    title: defaultBanner.title ?? "",
    subtitle: defaultBanner.subtitle ?? "",
    description: defaultBanner.description ?? "",
    banner_image_url: defaultBanner.banner_image_url ?? null as string | null,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const filename = `banners/tous-produits-${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("products").upload(filename, file, { upsert: true });
    if (uploadErr) { setError(uploadErr.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(filename);
    const newFields = { ...fields, banner_image_url: publicUrl };
    setFields(newFields);
    await save(newFields);
    setUploading(false);
  };

  const save = async (data = fields) => {
    setSaving(true);
    setError(null);
    setSaved(false);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("site_settings")
      .upsert({ key: "products_banner", value: data });
    if (err) setError(err.message);
    else setSaved(true);
    setSaving(false);
  };

  const inputClass = "w-full border border-brown/30 px-3 py-2 text-sm text-brown bg-white focus:outline-none focus:border-brown";
  const labelClass = "block text-xs tracking-widest uppercase text-warm-gray mb-1";

  return (
    <div className="bg-white border border-brown/10 p-6 space-y-4">
      {/* Banner image */}
      <div>
        <p className={labelClass}>Image de fond</p>
        <div
          className="relative h-32 bg-brown/10 cursor-pointer overflow-hidden group border border-brown/10"
          onClick={() => fileInputRef.current?.click()}
        >
          {fields.banner_image_url ? (
            <>
              <Image src={fields.banner_image_url} alt="" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px] font-bold tracking-widest uppercase">Changer</span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center gap-2 group-hover:bg-brown/20 transition-colors">
              <span className="text-brown/40 text-[10px] tracking-wider uppercase">Cliquer pour ajouter une image</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-brown text-xs">Upload...</span>
            </div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>

      <div>
        <label className={labelClass}>Titre</label>
        <input value={fields.title}
          onChange={(e) => setFields((p) => ({ ...p, title: e.target.value }))}
          className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Sous-titre</label>
        <input value={fields.subtitle}
          onChange={(e) => setFields((p) => ({ ...p, subtitle: e.target.value }))}
          className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea rows={2} value={fields.description}
          onChange={(e) => setFields((p) => ({ ...p, description: e.target.value }))}
          className={`${inputClass} resize-none`} />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => save()}
          disabled={saving}
          className="text-[10px] font-bold tracking-widest uppercase border border-brown text-brown px-5 py-2 hover:bg-brown hover:text-cream transition-colors disabled:opacity-40"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
        {saved && <span className="text-green-600 text-xs">Sauvegardé ✓</span>}
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </div>
    </div>
  );
}
