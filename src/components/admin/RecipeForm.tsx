"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Recipe, RecipeStep } from "@/types";

const CATEGORIES = [
  { value: "pains",          label: "Pains" },
  { value: "viennoiseries",  label: "Viennoiseries" },
  { value: "patisseries",    label: "Pâtisseries" },
  { value: "confitures",     label: "Confitures" },
  { value: "farines",        label: "Farines" },
];

const DIFFICULTIES = ["Facile", "Intermédiaire", "Avancé"];
const CHIP_COLORS  = ["green","blue","brown","red","cream"];

const EMPTY_STEP: RecipeStep = { title: "", chip: "", chip_color: "green", description: "" };

export default function RecipeForm({ recipe }: { recipe?: Recipe }) {
  const router      = useRouter();
  const fileRef     = useRef<HTMLInputElement>(null);
  const [loading, setLoading]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [preview, setPreview]     = useState<string | null>(recipe?.image_url ?? null);

  const [form, setForm] = useState({
    title:        recipe?.title        ?? "",
    slug:         recipe?.slug         ?? "",
    subtitle:     recipe?.subtitle     ?? "",
    excerpt:      recipe?.excerpt      ?? "",
    description:  recipe?.description  ?? "",
    image_url:    recipe?.image_url    ?? "",
    category:     recipe?.category     ?? "pains",
    difficulty:   recipe?.difficulty   ?? "Intermédiaire",
    total_time:   recipe?.total_time   ?? "",
    portions:     recipe?.portions     ?? "",
    badge:        recipe?.badge        ?? "",
    is_published: recipe?.is_published ?? false,
    sort_order:   recipe?.sort_order?.toString() ?? "0",
  });

  const [ingredients, setIngredients] = useState<string[]>(recipe?.ingredients ?? [""]);
  const [materiel,    setMateriel]    = useState<string[]>(recipe?.materiel    ?? [""]);
  const [steps,       setSteps]       = useState<RecipeStep[]>(recipe?.steps   ?? [{ ...EMPTY_STEP }]);
  const [tags,        setTags]        = useState<string>(recipe?.tags?.join(", ") ?? "");

  const inputClass    = "w-full border border-brown/30 px-3 py-2 text-sm text-brown bg-white focus:outline-none focus:border-brown";
  const labelClass    = "block text-xs tracking-widest uppercase text-warm-gray mb-1";
  const textareaClass = `${inputClass} resize-none`;

  /* ── Image upload ── */
  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const ext  = file.name.split(".").pop();
    const name = `recipes/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error: err } = await supabase.storage.from("products").upload(name, file, { upsert: false });
    if (err) { setError(err.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(data.path);
    setForm((p) => ({ ...p, image_url: publicUrl }));
    setPreview(publicUrl);
    setUploading(false);
  };

  /* ── Dynamic list helpers ── */
  const setListItem = (list: string[], setList: (v: string[]) => void, i: number, val: string) => {
    const next = [...list]; next[i] = val; setList(next);
  };
  const addListItem    = (list: string[], setList: (v: string[]) => void) => setList([...list, ""]);
  const removeListItem = (list: string[], setList: (v: string[]) => void, i: number) =>
    setList(list.filter((_, j) => j !== i));

  const setStepField = (i: number, key: keyof RecipeStep, val: string) => {
    const next = [...steps]; next[i] = { ...next[i], [key]: val }; setSteps(next);
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    const supabase = createClient();
    const payload = {
      ...form,
      sort_order:   parseInt(form.sort_order),
      badge:        form.badge || null,
      ingredients:  ingredients.filter(Boolean),
      materiel:     materiel.filter(Boolean),
      steps,
      tags:         tags.split(",").map((t) => t.trim()).filter(Boolean),
      published_at: form.is_published ? (recipe?.published_at ?? new Date().toISOString()) : null,
    };

    const { error: err } = recipe
      ? await supabase.from("recipes").update(payload).eq("id", recipe.id)
      : await supabase.from("recipes").insert(payload);

    if (err) { setError(err.message); setLoading(false); return; }
    router.push("/admin/recettes");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">

      {/* Image */}
      <div>
        <label className={labelClass}>Image de la recette</label>
        <div className="flex gap-4 items-start">
          <div
            className="w-32 h-24 border border-brown/20 bg-cream-dark relative overflow-hidden shrink-0 cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <Image src={preview} alt="Aperçu" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brown/20 text-2xl">+</div>
            )}
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-outline text-xs py-2 px-4 disabled:opacity-50">
              {uploading ? "Upload…" : "Choisir une image"}
            </button>
          </div>
        </div>
      </div>

      {/* Titre + slug */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Titre *</label>
          <input required value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              const slug  = title.toLowerCase()
                .normalize("NFD").replace(/[̀-ͯ]/g, "")
                .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
              setForm({ ...form, title, slug });
            }}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Slug</label>
          <input value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
            className={`${inputClass} text-warm-gray`} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Sous-titre (ex: Tradition Bordelaise · XVIIe siècle)</label>
        <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Introduction (affichée dans le hero)</label>
        <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={textareaClass} />
      </div>

      {/* Catégorie + difficulté + temps + portions */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className={labelClass}>Catégorie</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Difficulté</label>
          <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className={inputClass}>
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Temps total</label>
          <input value={form.total_time} onChange={(e) => setForm({ ...form, total_time: e.target.value })} placeholder="3h + repos nuit" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Portions</label>
          <input value={form.portions} onChange={(e) => setForm({ ...form, portions: e.target.value })} placeholder="12 canelés" className={inputClass} />
        </div>
      </div>

      {/* Tags + badge */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Tags (séparés par virgule)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Article récent, Pâtisserie régionale" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Badge</label>
          <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Nouveau, Bestseller…" className={inputClass} />
        </div>
      </div>

      {/* Ingrédients */}
      <div>
        <label className={labelClass}>Ingrédients</label>
        <div className="space-y-2">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2">
              <input value={ing} onChange={(e) => setListItem(ingredients, setIngredients, i, e.target.value)}
                placeholder={`Ingrédient ${i + 1}`} className={inputClass} />
              <button type="button" onClick={() => removeListItem(ingredients, setIngredients, i)}
                className="text-red-400 hover:text-red-600 text-lg px-2">×</button>
            </div>
          ))}
          <button type="button" onClick={() => addListItem(ingredients, setIngredients)}
            className="text-xs text-brown/60 hover:text-brown tracking-widest uppercase border border-brown/20 px-3 py-1 hover:border-brown transition-colors">
            + Ajouter un ingrédient
          </button>
        </div>
      </div>

      {/* Matériel */}
      <div>
        <label className={labelClass}>Matériel</label>
        <div className="space-y-2">
          {materiel.map((m, i) => (
            <div key={i} className="flex gap-2">
              <input value={m} onChange={(e) => setListItem(materiel, setMateriel, i, e.target.value)}
                placeholder={`Matériel ${i + 1}`} className={inputClass} />
              <button type="button" onClick={() => removeListItem(materiel, setMateriel, i)}
                className="text-red-400 hover:text-red-600 text-lg px-2">×</button>
            </div>
          ))}
          <button type="button" onClick={() => addListItem(materiel, setMateriel)}
            className="text-xs text-brown/60 hover:text-brown tracking-widest uppercase border border-brown/20 px-3 py-1 hover:border-brown transition-colors">
            + Ajouter un équipement
          </button>
        </div>
      </div>

      {/* Étapes */}
      <div>
        <label className={labelClass}>Étapes de la recette</label>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="border border-brown/20 p-4 bg-cream-dark space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brown tracking-widest">Étape {String(i + 1).padStart(2, "0")}</span>
                {steps.length > 1 && (
                  <button type="button" onClick={() => setSteps(steps.filter((_, j) => j !== i))}
                    className="text-red-400 hover:text-red-600 text-xs tracking-widest uppercase">
                    Supprimer
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className={labelClass}>Titre de l&apos;étape</label>
                  <input value={step.title} onChange={(e) => setStepField(i, "title", e.target.value)}
                    placeholder="Préparer la base lait" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Chip label</label>
                  <input value={step.chip} onChange={(e) => setStepField(i, "chip", e.target.value)}
                    placeholder="BEURRE" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Couleur chip</label>
                <div className="flex gap-2 mt-1">
                  {CHIP_COLORS.map((c) => (
                    <button key={c} type="button"
                      onClick={() => setStepField(i, "chip_color", c)}
                      className={`text-[9px] tracking-widest uppercase px-2 py-1 border transition-colors ${
                        step.chip_color === c ? "border-brown bg-brown text-cream" : "border-brown/30 text-brown/50 hover:border-brown"
                      }`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea rows={3} value={step.description}
                  onChange={(e) => setStepField(i, "description", e.target.value)}
                  className={textareaClass} />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setSteps([...steps, { ...EMPTY_STEP }])}
            className="text-xs text-brown/60 hover:text-brown tracking-widest uppercase border border-brown/20 px-3 py-1 hover:border-brown transition-colors">
            + Ajouter une étape
          </button>
        </div>
      </div>

      {/* Publication */}
      <div className="flex items-center gap-4 border-t border-brown/10 pt-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_published}
            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            className="w-4 h-4" />
          <span className="text-xs tracking-widest uppercase text-brown">Publier cet article</span>
        </label>
        <div className="ml-auto">
          <label className={labelClass}>Ordre</label>
          <input type="number" value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
            className={`${inputClass} w-20`} />
        </div>
      </div>

      {error && <p className="text-xs text-red-600 bg-red-50 p-3">{error}</p>}

      <div className="flex gap-4">
        <button type="submit" disabled={loading || uploading} className="btn-primary disabled:opacity-50">
          {loading ? "Enregistrement…" : recipe ? "Mettre à jour" : "Créer la recette"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">Annuler</button>
      </div>
    </form>
  );
}
