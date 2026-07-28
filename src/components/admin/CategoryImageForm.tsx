"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";

export default function CategoryImageForm({ category }: { category: Category }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(category.image_url);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSaved(false);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const filename = `categories/${category.slug}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filename, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("products")
      .getPublicUrl(filename);

    const { error: updateError } = await supabase
      .from("categories")
      .update({ image_url: publicUrl })
      .eq("id", category.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setImageUrl(publicUrl);
      setSaved(true);
    }

    setUploading(false);
  };

  const handleRemove = async () => {
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("categories")
      .update({ image_url: null })
      .eq("id", category.id);

    if (!updateError) {
      setImageUrl(null);
      setSaved(true);
    }
  };

  return (
    <div className="flex items-center gap-6 bg-white border border-brown/10 p-4">
      {/* Preview */}
      <div
        className="relative w-24 h-24 shrink-0 bg-brown/10 cursor-pointer overflow-hidden group"
        onClick={() => fileInputRef.current?.click()}
      >
        {imageUrl ? (
          <>
            <Image src={imageUrl} alt={category.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-[10px] font-bold tracking-widest uppercase">Changer</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 group-hover:bg-brown/20 transition-colors">
            <span className="text-brown/30 text-2xl">+</span>
            <span className="text-brown/40 text-[9px] tracking-wider uppercase">Image</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-brown tracking-wide">{category.name}</p>
        <p className="text-[11px] text-warm-gray tracking-wider">/{category.slug}</p>

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        {saved && <p className="text-green-600 text-xs mt-1">Enregistré ✓</p>}
        {uploading && <p className="text-brown/50 text-xs mt-1">Upload en cours...</p>}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 shrink-0">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-[10px] font-bold tracking-widest uppercase border border-brown text-brown px-4 py-2 hover:bg-brown hover:text-cream transition-colors disabled:opacity-40"
        >
          {uploading ? "..." : imageUrl ? "Changer" : "Ajouter"}
        </button>
        {imageUrl && (
          <button
            onClick={handleRemove}
            className="text-[10px] tracking-widest uppercase text-red-400 hover:text-red-600 transition-colors px-4 py-2 border border-red-200 hover:border-red-400"
          >
            Supprimer
          </button>
        )}
      </div>
    </div>
  );
}
