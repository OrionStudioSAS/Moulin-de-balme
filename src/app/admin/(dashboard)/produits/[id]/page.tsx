import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parisToday } from "@/lib/bo/dates";
import type { Category, Product, Subcategory } from "@/types";
import ProductEditor from "@/components/bo/products/ProductEditor";

export const metadata: Metadata = { title: "Produit" };

export default async function EditProduitPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const [{ data: product }, { data: categories }, { data: subcategories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", params.id).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("subcategories").select("*").order("sort_order"),
  ]);
  if (!product) notFound();

  return (
    <ProductEditor
      key={product.id}
      product={product as Product}
      categories={(categories ?? []) as Category[]}
      subcategories={(subcategories ?? []) as Subcategory[]}
      today={parisToday()}
    />
  );
}
