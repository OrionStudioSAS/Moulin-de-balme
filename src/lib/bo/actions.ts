"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { Category, Recipe, Subcategory } from "@/types";
import { commiter, type Changement } from "@/lib/contenu/depot";
import { fichiers, lireDans, tagContenu, versJson, type BanniereProduits, type CleContenu, type FicheProduit } from "@/lib/contenu/stockage";
import { fermerSession, getUtilisateur, ouvrirSession, verifierIdentifiants } from "./session";

export type Resultat<T = object> = ({ ok: true } & T) | { ok: false; erreur: string; detail?: string };

/* ── Connexion ─────────────────────────────────────────────────────────── */

export async function seConnecter(email: string, motDePasse: string): Promise<Resultat> {
  if (!email.trim() || !motDePasse) return { ok: false, erreur: "identifiants" };
  const compte = await verifierIdentifiants(email, motDePasse);
  // Message générique côté interface : ne pas révéler si le compte existe.
  if (!compte) return { ok: false, erreur: "identifiants" };
  try {
    await ouvrirSession(compte);
  } catch (erreur) {
    console.error("Ouverture de session impossible", erreur);
    return { ok: false, erreur: "configuration" };
  }
  return { ok: true };
}

export async function seDeconnecter() {
  fermerSession();
  redirect("/admin/login");
}

/* ── Outils ────────────────────────────────────────────────────────────── */

async function verifier() {
  if (!(await getUtilisateur())) throw new Error("Non autorisé");
}

type Lecteur = (chemin: string) => Promise<string | null>;

/**
 * Publie une modification en un commit sur le dépôt du site, puis invalide le cache
 * des fichiers touchés. `preparer` renvoie les nouveaux contenus par clé, ou null.
 */
async function publier(
  message: string,
  preparer: (lire: Lecteur) => Promise<Partial<Record<CleContenu, unknown>> | null>
): Promise<Resultat> {
  try {
    await verifier();
    const touches: CleContenu[] = [];
    await commiter("site", `Admin : ${message}`, async (lire) => {
      const nouveaux = await preparer(lire);
      if (!nouveaux) return null;
      touches.splice(0, touches.length, ...(Object.keys(nouveaux) as CleContenu[]));
      return touches.map<Changement>((cle) => ({ chemin: fichiers[cle].chemin, contenu: versJson(nouveaux[cle]) }));
    });
    touches.forEach((cle) => revalidateTag(tagContenu(cle)));
    return { ok: true };
  } catch (erreur) {
    console.error(`Publication impossible (${message})`, erreur);
    return { ok: false, erreur: erreur instanceof Error && erreur.message === "Non autorisé" ? "autorisation" : "serveur" };
  }
}

const parOrdre = <T extends { sort_order: number }>(a: T, b: T) => a.sort_order - b.sort_order;

/* ── Produits ──────────────────────────────────────────────────────────── */

// Les variations ne sont pas éditables dans l'admin : elles sont conservées telles quelles.
export type ChampsProduit = Omit<FicheProduit, "id" | "created_at" | "variations">;

export async function basculerProduit(id: string, champ: "is_available" | "is_featured", valeur: boolean) {
  return publier(`produit ${champ === "is_available" ? "disponibilité" : "mise en avant"}`, async (lire) => {
    const produits = await lireDans(lire, "produits");
    if (!produits.some((p) => p.id === id)) return null;
    return { produits: produits.map((p) => (p.id === id ? { ...p, [champ]: valeur } : p)) };
  });
}

/** Jours de vente (page « La semaine » et fiche produit). */
export async function majJoursVente(id: string, available_days: string[], is_semaine: boolean) {
  return publier("jours de vente", async (lire) => {
    const produits = await lireDans(lire, "produits");
    if (!produits.some((p) => p.id === id)) return null;
    return { produits: produits.map((p) => (p.id === id ? { ...p, available_days: [...available_days].sort(), is_semaine } : p)) };
  });
}

export async function enregistrerProduit(id: string | null, champs: ChampsProduit): Promise<Resultat<{ id: string }>> {
  const nouvelId = id ?? crypto.randomUUID();
  let slugPris = false;
  const res = await publier(`${id ? "modification" : "création"} du produit « ${champs.name} »`, async (lire) => {
    const produits = await lireDans(lire, "produits");
    if (produits.some((p) => p.slug === champs.slug && p.id !== id)) {
      slugPris = true;
      return null;
    }
    if (id) {
      if (!produits.some((p) => p.id === id)) return null;
      return { produits: produits.map((p) => (p.id === id ? { ...p, ...champs, id } : p)) };
    }
    return { produits: [...produits, { ...champs, variations: [], id: nouvelId, created_at: new Date().toISOString() } as FicheProduit] };
  });
  if (slugPris) return { ok: false, erreur: "slug" };
  return res.ok ? { ok: true, id: nouvelId } : res;
}

export async function supprimerProduit(id: string) {
  return publier("suppression d'un produit", async (lire) => {
    const produits = await lireDans(lire, "produits");
    if (!produits.some((p) => p.id === id)) return null;
    return { produits: produits.filter((p) => p.id !== id) };
  });
}

/* ── Catégories ────────────────────────────────────────────────────────── */

export type ChampsCategorie = Pick<Category, "image_url" | "banner_image_url" | "banner_title" | "banner_subtitle" | "banner_description">;
export type SousCategorieSaisie = { id: string; name: string; isNew?: boolean };

const slugifier = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/[\s-]+/g, "-");

/** Un seul enregistrement pour la catégorie : visuels, textes et sous-catégories. */
export async function enregistrerCategorie(id: string, champs: ChampsCategorie, sous: SousCategorieSaisie[]) {
  return publier("catégorie", async (lire) => {
    const [categories, sousCategories, produits] = await Promise.all([lireDans(lire, "categories"), lireDans(lire, "sousCategories"), lireDans(lire, "produits")]);
    if (!categories.some((c) => c.id === id)) return null;

    const gardees = new Set(sous.filter((s) => !s.isNew).map((s) => s.id));
    const retirees = new Set(sousCategories.filter((s) => s.category_id === id && !gardees.has(s.id)).map((s) => s.id));
    const ajoutees: Subcategory[] = sous
      .filter((s) => s.isNew)
      .map((s, i) => ({ id: crypto.randomUUID(), category_id: id, name: s.name.trim(), slug: slugifier(s.name), sort_order: sous.length - sous.filter((x) => x.isNew).length + i, created_at: new Date().toISOString() }));

    return {
      categories: categories.map((c) => (c.id === id ? { ...c, ...champs } : c)),
      sousCategories: [...sousCategories.filter((s) => !retirees.has(s.id)), ...ajoutees],
      ...(retirees.size ? { produits: produits.map((p) => (p.subcategory_id && retirees.has(p.subcategory_id) ? { ...p, subcategory_id: null } : p)) } : {}),
    };
  });
}

export async function creerCategorie(nom: string, slug: string): Promise<Resultat<{ slug: string }>> {
  const final = slugifier(slug || nom);
  let pris: string | null = null;
  const res = await publier(`création de la catégorie « ${nom} »`, async (lire) => {
    const categories = await lireDans(lire, "categories");
    const existante = categories.find((c) => c.slug === final);
    if (existante) {
      pris = existante.name;
      return null;
    }
    const ordre = Math.max(0, ...categories.map((c) => c.sort_order)) + 1;
    const nouvelle: Category = {
      id: crypto.randomUUID(), name: nom.trim(), slug: final, description: null, image_url: null, banner_image_url: null,
      banner_title: null, banner_subtitle: null, banner_description: null, sort_order: ordre, created_at: new Date().toISOString(),
    };
    return { categories: [...categories, nouvelle].sort(parOrdre) };
  });
  if (pris) return { ok: false, erreur: "slug", detail: pris };
  return res.ok ? { ok: true, slug: final } : res;
}

/** Les produits passent en « Sans catégorie » ; les sous-catégories sont supprimées. */
export async function supprimerCategorie(id: string) {
  return publier("suppression d'une catégorie", async (lire) => {
    const [categories, sousCategories, produits] = await Promise.all([lireDans(lire, "categories"), lireDans(lire, "sousCategories"), lireDans(lire, "produits")]);
    if (!categories.some((c) => c.id === id)) return null;
    return {
      categories: categories.filter((c) => c.id !== id),
      sousCategories: sousCategories.filter((s) => s.category_id !== id),
      produits: produits.map((p) => (p.category_id === id ? { ...p, category_id: null, subcategory_id: null } : p)),
    };
  });
}

export async function enregistrerBanniereProduits(banniere: BanniereProduits) {
  return publier("bannière « Tous les produits »", async (lire) => {
    const reglages = await lireDans(lire, "reglages");
    return { reglages: { ...reglages, banniereProduits: banniere } };
  });
}

/* ── Recettes ──────────────────────────────────────────────────────────── */

// L'extrait n'est pas éditable dans l'admin : il est conservé tel quel.
export type ChampsRecette = Omit<Recipe, "id" | "created_at" | "excerpt">;

export async function enregistrerRecette(id: string | null, champs: ChampsRecette): Promise<Resultat<{ id: string }>> {
  const nouvelId = id ?? crypto.randomUUID();
  let slugPris = false;
  const res = await publier(`${id ? "modification" : "création"} de la recette « ${champs.title} »`, async (lire) => {
    const recettes = await lireDans(lire, "recettes");
    if (recettes.some((r) => r.slug === champs.slug && r.id !== id)) {
      slugPris = true;
      return null;
    }
    if (id) {
      if (!recettes.some((r) => r.id === id)) return null;
      return { recettes: recettes.map((r) => (r.id === id ? { ...r, ...champs, id } : r)) };
    }
    return { recettes: [...recettes, { ...champs, excerpt: null, id: nouvelId, created_at: new Date().toISOString() }] };
  });
  if (slugPris) return { ok: false, erreur: "slug" };
  return res.ok ? { ok: true, id: nouvelId } : res;
}

export async function supprimerRecette(id: string) {
  return publier("suppression d'une recette", async (lire) => {
    const recettes = await lireDans(lire, "recettes");
    if (!recettes.some((r) => r.id === id)) return null;
    return { recettes: recettes.filter((r) => r.id !== id) };
  });
}
