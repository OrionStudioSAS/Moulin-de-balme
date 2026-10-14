import "server-only";

import { unstable_cache } from "next/cache";
import categoriesEmbarquees from "@contenu/categories.json";
import produitsEmbarques from "@contenu/produits.json";
import recettesEmbarquees from "@contenu/recettes.json";
import reglagesEmbarques from "@contenu/reglages.json";
import sousCategoriesEmbarquees from "@contenu/sous-categories.json";
import type { Category, Order, Product, Recipe, Subcategory } from "@/types";
import { depotConfigure, lireTexte, type Depot } from "./depot";

export type BanniereProduits = { title?: string; subtitle?: string; description?: string; banner_image_url?: string | null };
export type Reglages = { banniereProduits: BanniereProduits };

/** Fiches telles qu'enregistrées dans les fichiers (sans jointures). */
export type FicheProduit = Omit<Product, "category" | "subcategory">;
export type FicheCommande = Order;

type Fichiers = {
  produits: FicheProduit[];
  categories: Category[];
  sousCategories: Subcategory[];
  recettes: Recipe[];
  reglages: Reglages;
  commandes: FicheCommande[];
};

export type CleContenu = keyof Fichiers;

/** Emplacement de chaque fichier ; les commandes vivent dans le dépôt privé. */
export const fichiers: Record<CleContenu, { depot: Depot; chemin: string }> = {
  produits: { depot: "site", chemin: "contenu/produits.json" },
  categories: { depot: "site", chemin: "contenu/categories.json" },
  sousCategories: { depot: "site", chemin: "contenu/sous-categories.json" },
  recettes: { depot: "site", chemin: "contenu/recettes.json" },
  reglages: { depot: "site", chemin: "contenu/reglages.json" },
  commandes: { depot: "commandes", chemin: "commandes.json" },
};

/** Dossier des images déposées depuis l'admin, servies par /fichiers/… */
export const DOSSIER_FICHIERS = "contenu/fichiers";

/** Version embarquée au build : secours si GitHub est injoignable (pas pour les commandes, privées). */
const embarques: Fichiers = {
  produits: produitsEmbarques as unknown as FicheProduit[],
  categories: categoriesEmbarquees as unknown as Category[],
  sousCategories: sousCategoriesEmbarquees as unknown as Subcategory[],
  recettes: recettesEmbarquees as unknown as Recipe[],
  reglages: reglagesEmbarques as unknown as Reglages,
  commandes: [],
};

export const tagContenu = (cle: CleContenu) => `contenu:${cle}`;

async function lireDepuisGithub<C extends CleContenu>(cle: C): Promise<Fichiers[C]> {
  if (!depotConfigure()) return embarques[cle];
  const { depot, chemin } = fichiers[cle];
  try {
    const texte = await lireTexte(depot, chemin);
    if (texte !== null) return JSON.parse(texte) as Fichiers[C];
    console.error(`Contenu « ${cle} » absent du dépôt : copie embarquée utilisée.`);
  } catch (erreur) {
    console.error(`Lecture du contenu « ${cle} » sur GitHub impossible`, erreur);
    if (cle === "commandes") throw erreur;
  }
  return embarques[cle];
}

/**
 * Dernière version publiée d'un fichier, lue sur GitHub et mise en cache. Chaque
 * publication de l'admin invalide l'étiquette correspondante : le site est à jour
 * tout de suite, sans redéploiement. Le délai de 5 min rattrape une modification
 * faite directement sur GitHub.
 */
export function lireContenu<C extends CleContenu>(cle: C): Promise<Fichiers[C]> {
  return unstable_cache(() => lireDepuisGithub(cle), ["contenu", cle], { tags: [tagContenu(cle)], revalidate: 300 })();
}

/** Même lecture au sein d'un commit (cf. `commiter`) : version figée du dépôt. */
export async function lireDans<C extends CleContenu>(lire: (chemin: string) => Promise<string | null>, cle: C): Promise<Fichiers[C]> {
  const texte = await lire(fichiers[cle].chemin);
  return texte === null ? embarques[cle] : (JSON.parse(texte) as Fichiers[C]);
}

/** Sérialisation stable, lisible dans les diffs GitHub. */
export const versJson = (valeur: unknown) => `${JSON.stringify(valeur, null, 2)}\n`;
