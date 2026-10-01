import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Sans cette config, tailwind-merge confond `text-bo-body` (taille) et `text-bo-ink` (couleur) et en supprime un
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["bo-display", "bo-display-s", "bo-brand", "bo-kpi", "bo-heading", "bo-card", "bo-body", "bo-small", "bo-caption"] }],
      shadow: [{ shadow: ["bo-xs", "bo-md", "bo-lg", "bo-focus", "bo-focus-danger"] }],
      rounded: [{ rounded: ["bo-sm", "bo-md", "bo-lg", "bo-xl"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
