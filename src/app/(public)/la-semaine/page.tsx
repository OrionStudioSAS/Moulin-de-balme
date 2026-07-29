import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";
import SemaineCalendar from "@/components/semaine/SemaineCalendar";

export default async function LaSemainePage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_available", true)
    .eq("is_semaine", true)
    .order("sort_order");

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
