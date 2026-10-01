import type { TKey } from "./i18n";

export const RECIPE_CATEGORIES: { value: string; label: TKey }[] = [
  { value: "pains", label: "recipes.catPains" },
  { value: "viennoiseries", label: "recipes.catViennoiseries" },
  { value: "patisseries", label: "recipes.catPatisseries" },
  { value: "confitures", label: "recipes.catConfitures" },
  { value: "farines", label: "recipes.catFarines" },
];

/** Valeurs stockées en base (inchangées) → libellé et niveau (1 à 3 barres) */
export const DIFFICULTIES: { value: string; label: TKey; level: number }[] = [
  { value: "Facile", label: "recipes.diffFacile", level: 1 },
  { value: "Intermédiaire", label: "recipes.diffIntermediaire", level: 2 },
  { value: "Avancé", label: "recipes.diffAvance", level: 3 },
];

export const CHIP_COLORS: { value: "green" | "blue" | "brown" | "red" | "cream"; label: TKey }[] = [
  { value: "green", label: "recipes.colorGreen" },
  { value: "blue", label: "recipes.colorBlue" },
  { value: "brown", label: "recipes.colorBrown" },
  { value: "red", label: "recipes.colorRed" },
  { value: "cream", label: "recipes.colorCream" },
];

export const categoryLabel = (value: string): TKey | null => RECIPE_CATEGORIES.find((c) => c.value === value)?.label ?? null;
export const difficultyOf = (value: string) => DIFFICULTIES.find((d) => d.value === value) ?? null;
