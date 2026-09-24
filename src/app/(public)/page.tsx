import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";

export const metadata: Metadata = {
  title: { absolute: "Le Moulin de Balme® — Boulangerie Artisanale à Brive-la-Gaillarde" },
  description:
    "Boulangerie artisanale au cœur de Brive-la-Gaillarde. Pains au levain, viennoiseries, pâtisseries façonnés à la main par Stéphane Reinat. Click & Collect disponible.",
  alternates: { canonical: "https://www.moulin-de-balme.fr" },
  openGraph: {
    title: "Le Moulin de Balme® — Boulangerie Artisanale à Brive-la-Gaillarde",
    description:
      "Pains au levain, viennoiseries et pâtisseries artisanales à Brive-la-Gaillarde (Corrèze). Click & Collect disponible.",
    url: "https://www.moulin-de-balme.fr",
  },
};

import SortieDuFour from "@/components/home/SortieDuFour";
import HistoireSection from "@/components/home/HistoireSection";
import NosProduits from "@/components/home/NosProduits";
import LaSemaine from "@/components/home/LaSemaine";
import NosFarines from "@/components/home/NosFarines";
import ContactSection from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SortieDuFour />
      <HistoireSection />
      <NosProduits />
      <LaSemaine />
      <NosFarines />
      <ContactSection />
    </>
  );
}
