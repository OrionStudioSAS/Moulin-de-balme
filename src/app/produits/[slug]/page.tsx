import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .single();

  if (!product) notFound();

  const days = product.available_days as string[];

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex gap-2 items-center text-xs tracking-wider text-warm-gray mb-8">
          <Link href="/" className="hover:text-brown transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/produits" className="hover:text-brown transition-colors">Produits</Link>
          <span>/</span>
          <span className="text-brown">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square bg-cream-dark relative overflow-hidden">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brown/5 to-gold/20" />
            )}
          </div>

          {/* Info */}
          <div>
            {product.category && (
              <p className="label-tag mb-3">{product.category.name}</p>
            )}
            <h1 className="text-3xl font-bold tracking-widest uppercase text-brown mb-4">
              {product.name}
            </h1>
            {product.description && (
              <p className="text-sm text-warm-gray leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            <p className="text-2xl font-bold text-brown mb-6">
              {product.price > 0 ? `${product.price.toFixed(2)} €` : "Prix sur demande"}
            </p>

            {days.length > 0 && (
              <div className="mb-6">
                <p className="text-xs tracking-widest uppercase text-brown mb-2">
                  Disponible
                </p>
                <div className="flex flex-wrap gap-2">
                  {days.map((day) => (
                    <span
                      key={day}
                      className="text-xs tracking-wider border border-brown/30 px-3 py-1 capitalize"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link href="/click-and-collect" className="btn-primary inline-block">
              Commander en Click &amp; Collect
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
