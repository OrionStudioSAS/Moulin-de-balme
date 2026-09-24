import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Product } from "@/types";
import ProductDetail from "@/components/ProductDetail";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("name,description,image_url").eq("slug", slug).single();
  if (!data) return { title: "Produit" };
  return {
    title: data.name,
    description: data.description
      ? data.description.slice(0, 155)
      : `Découvrez ${data.name}, produit artisanal du Moulin de Balme à Brive-la-Gaillarde.`,
    alternates: { canonical: `https://www.moulin-de-balme.fr/produits/${slug}` },
    openGraph: {
      title: `${data.name} — Le Moulin de Balme®`,
      description: data.description?.slice(0, 155) ?? `Produit artisanal — Le Moulin de Balme, Brive-la-Gaillarde.`,
      images: data.image_url ? [{ url: data.image_url, alt: data.name }] : undefined,
      url: `https://www.moulin-de-balme.fr/produits/${slug}`,
    },
  };
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
