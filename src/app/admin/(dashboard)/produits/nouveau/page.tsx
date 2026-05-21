import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";

export default async function NouveauProduitPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-bold tracking-widests uppercase text-brown mb-8">
        Nouveau produit
      </h1>
      <ProductForm categories={categories ?? []} />
    </div>
  );
}
