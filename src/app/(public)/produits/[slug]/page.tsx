import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Product } from "@/types";
import ProductDetail from "@/components/ProductDetail";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("name,description").eq("slug", slug).single();
  return { title: data ? `${data.name} — Le Moulin de Balme®` : "Produit" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .single();

  if (!product) notFound();

  const { data: similar } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_available", true)
    .eq("category_id", product.category_id)
    .neq("slug", slug)
    .order("sort_order")
    .limit(4);

  return <ProductDetail product={product as Product} similar={(similar ?? []) as Product[]} />;
}
