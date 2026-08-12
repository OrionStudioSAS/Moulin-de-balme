import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";
import SortieDuFourCard from "./SortieDuFourCard";

export default async function SortieDuFour() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_available", true)
    .eq("is_featured", true)
    .order("sort_order")
    .limit(4);

  const items = products ?? [];

  return (
    <section className="bg-cream px-6 md:px-12 py-6 md:py-12">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-8 mb-10">
          <h2 className="text-[clamp(2.2rem,4vw,4.5rem)] font-bold uppercase tracking-tight leading-none text-brown shrink-0">
            Sortie<br />du four
          </h2>
          <div className="flex flex-col items-end justify-between gap-4 pt-1 flex-1 min-w-0">
            <p className="text-[11px] tracking-[0.15em] uppercase text-brown font-medium leading-relaxed text-right max-w-xs">
              Chaque pièce est façonnée à la main, levée plusieurs heures, cuite sur sole. Rien de plus. La farine, l&apos;eau, le sel, le levain et le temps.
            </p>
            <Link
              href="/produits"
              className="text-[11px] font-bold tracking-widest uppercase text-brown border-b border-brown pb-0.5 hover:opacity-60 transition-opacity whitespace-nowrap"
            >
              Voir tout
            </Link>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((product: Product) => (
            <SortieDuFourCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
