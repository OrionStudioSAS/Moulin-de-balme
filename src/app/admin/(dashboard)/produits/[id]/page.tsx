import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProduitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }, { data: subcategories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("subcategories").select("*").order("sort_order"),
  ]);

  if (!product) notFound();

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-bold tracking-widests uppercase text-brown mb-8">
        Modifier — {product.name}
      </h1>
      <ProductForm categories={categories ?? []} subcategories={subcategories ?? []} product={product} />
    </div>
  );
}
