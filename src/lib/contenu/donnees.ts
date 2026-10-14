import "server-only";

import type { Category, Order, Product, Recipe, Subcategory } from "@/types";
import { lireContenu } from "./stockage";

const parOrdre = <T extends { sort_order: number }>(a: T, b: T) => a.sort_order - b.sort_order;

/** Produits avec leur catégorie et sous-catégorie (équivalent des jointures Supabase). */
export async function getProduits(options: { disponibles?: boolean } = {}): Promise<Product[]> {
  const [produits, categories, sous] = await Promise.all([lireContenu("produits"), lireContenu("categories"), lireContenu("sousCategories")]);
  const cats = new Map(categories.map((c) => [c.id, c]));
  const subs = new Map(sous.map((s) => [s.id, s]));
  return produits
    .filter((p) => !options.disponibles || p.is_available)
    .map((p) => ({
      ...p,
      category: (p.category_id && cats.get(p.category_id)) || undefined,
      subcategory: (p.subcategory_id && subs.get(p.subcategory_id)) || undefined,
    }))
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name, "fr"));
}

export async function getProduit(slug: string, options: { disponible?: boolean } = {}) {
  const produit = (await getProduits()).find((p) => p.slug === slug) ?? null;
  return produit && (!options.disponible || produit.is_available) ? produit : null;
}

export async function getProduitParId(id: string) {
  return (await getProduits()).find((p) => p.id === id) ?? null;
}

export async function getCategories(): Promise<Category[]> {
  return [...(await lireContenu("categories"))].sort(parOrdre);
}

export async function getSousCategories(): Promise<Subcategory[]> {
  return [...(await lireContenu("sousCategories"))].sort(parOrdre);
}

/** Recettes, publiées seulement par défaut, triées par date de publication décroissante. */
export async function getRecettes(options: { toutes?: boolean } = {}): Promise<Recipe[]> {
  const recettes = await lireContenu("recettes");
  return recettes
    .filter((r) => options.toutes || r.is_published)
    .sort((a, b) => (b.published_at ?? b.created_at ?? "").localeCompare(a.published_at ?? a.created_at ?? ""));
}

export async function getRecette(slug: string, options: { toutes?: boolean } = {}) {
  return (await getRecettes(options)).find((r) => r.slug === slug) ?? null;
}

export async function getReglages() {
  return lireContenu("reglages");
}

export async function getCommandes(): Promise<Order[]> {
  return lireContenu("commandes");
}
