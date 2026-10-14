import { notFound } from "next/navigation";
import { getProduit, getProduits } from "@/lib/contenu/donnees";
import ProductDetail from "@/components/ProductDetail";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProduit(slug);
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
  const product = await getProduit(slug);
  if (!product) notFound();

  const similar = (await getProduits({ disponibles: true }))
    .filter((p) => p.category_id === product.category_id && p.slug !== slug)
    .slice(0, 4);

  return <ProductDetail product={product} similar={similar} />;
}
