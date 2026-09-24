import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ClickCollectForm from "@/components/ClickCollectForm";

export const metadata: Metadata = {
  title: "Click & Collect — Commander en ligne",
  description:
    "Commandez vos pains, viennoiseries et pâtisseries en ligne et retirez-les directement au Moulin de Balme, 7 avenue Alsace-Lorraine à Brive-la-Gaillarde.",
  alternates: { canonical: "https://www.moulin-de-balme.fr/click-and-collect" },
  openGraph: {
    title: "Click & Collect — Le Moulin de Balme®",
    description:
      "Commandez avant 17h, retirez votre commande le lendemain dès 7h au Moulin de Balme à Brive-la-Gaillarde.",
    url: "https://www.moulin-de-balme.fr/click-and-collect",
  },
};

import type { Product } from "@/types";

export default async function ClickCollectPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_available", true)
    .order("sort_order");

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-brown py-20 px-4 md:px-8 text-center">
        <p className="label-tag text-cream/60 mb-3">Commander</p>
        <h1 className="section-title text-cream">Click &amp; Collect</h1>
        <p className="text-xs text-cream/60 mt-3 tracking-wider max-w-md mx-auto">
          Commandez avant 17h, retirez votre commande le lendemain dès 7h en boutique.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <ClickCollectForm products={products ?? []} />
      </div>
    </div>
  );
}
