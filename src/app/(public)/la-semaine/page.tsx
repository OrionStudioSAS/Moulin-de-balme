import type { Metadata } from "next";
import { getProduits } from "@/lib/contenu/donnees";
import type { Product } from "@/types";
import SemaineCalendar from "@/components/semaine/SemaineCalendar";

export const metadata: Metadata = {
  title: "La Semaine — Produits du moment",
  description:
    "Découvrez les produits de la semaine au Moulin de Balme. Pains spéciaux, viennoiseries et créations artisanales qui changent chaque semaine à Brive-la-Gaillarde.",
  alternates: { canonical: "https://www.moulin-de-balme.fr/la-semaine" },
  openGraph: {
    title: "La Semaine — Le Moulin de Balme®",
    description:
      "Les produits artisanaux de la semaine au Moulin de Balme, boulangerie à Brive-la-Gaillarde.",
    url: "https://www.moulin-de-balme.fr/la-semaine",
  },
};


export default async function LaSemainePage() {
  const products = (await getProduits({ disponibles: true })).filter((p) => p.is_semaine);

  const items = (products ?? []) as Product[];

  return (
    <div>
      {/* Fond sombre pour le calendrier */}
      <div className="bg-[#2A1F1A] mt-[-64px] pt-[64px]">
        <SemaineCalendar products={items} />
      </div>

      {/* Instagram + presse */}
    </div>
  );
}
