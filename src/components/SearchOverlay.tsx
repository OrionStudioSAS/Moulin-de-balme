"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types";

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .ilike("name", `%${query}%`)
        .eq("is_available", true)
        .limit(6);
      setResults(data ?? []);
      setLoading(false);
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  if (!open) return null;

  const handleSelect = (slug: string) => {
    onClose();
    router.push(`/produits/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 bg-white w-full shadow-xl">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-5 flex items-center gap-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black/40 shrink-0">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit..."
            className="flex-1 text-base text-black placeholder-black/30 bg-transparent outline-none tracking-wide"
            onKeyDown={(e) => e.key === "Escape" && onClose()}
          />
          <button
            onClick={onClose}
            className="text-[11px] tracking-widest uppercase text-black/40 hover:text-black transition-colors font-bold"
          >
            Fermer
          </button>
        </div>

        {/* Results */}
        {query.trim() && (
          <div className="border-t border-black/10">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-4">
              {loading ? (
                <p className="text-xs tracking-wider text-black/40 py-2">Recherche...</p>
              ) : results.length === 0 ? (
                <p className="text-xs tracking-wider text-black/40 py-2">
                  Aucun résultat pour &ldquo;{query}&rdquo;
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {results.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelect(p.slug)}
                      className="text-left group"
                    >
                      <div className="aspect-square bg-black/5 relative overflow-hidden mb-2">
                        {p.image_url ? (
                          <Image src={p.image_url} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-brown/10 to-gold/10" />
                        )}
                      </div>
                      <p className="text-[11px] font-bold tracking-wider uppercase text-black truncate">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-black/50 mt-0.5">
                        {p.price.toFixed(2).replace(".", ",")} €
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
