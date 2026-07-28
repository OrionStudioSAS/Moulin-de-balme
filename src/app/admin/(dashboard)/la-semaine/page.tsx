import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";
import SemaineMatrix from "@/components/admin/SemaineMatrix";

export default async function AdminLaSemainePage() {
  const supabase = await createClient();

  const [{ data: semaineRaw }, { data: allRaw }] = await Promise.all([
    supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("is_semaine", true)
      .order("sort_order"),
    supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("is_available", true)
      .order("name"),
  ]);

  const semaineProducts = (semaineRaw ?? []) as Product[];
  const allProducts     = (allRaw ?? []) as Product[];

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brown uppercase tracking-tight">La Semaine</h1>
        <p className="text-sm text-warm-gray mt-1">
          Gérez les produits disponibles chaque jour de la semaine. Cochez les jours
          de disponibilité pour chaque produit.
        </p>
      </div>

      <SemaineMatrix products={semaineProducts} allProducts={allProducts} />
    </div>
  );
}
