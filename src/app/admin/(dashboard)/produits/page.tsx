import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProduitsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .order("sort_order");

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-xl font-bold tracking-widest uppercase text-brown">Produits</h1>
        <Link href="/admin/produits/nouveau" className="btn-primary whitespace-nowrap">
          + Ajouter<span className="hidden sm:inline"> un produit</span>
        </Link>
      </div>

      {/* Cartes — mobile */}
      <div className="md:hidden bg-white border border-brown/10 divide-y divide-brown/10">
        {(products ?? []).map((product: Product) => (
          <div key={product.id} className="flex items-center gap-3 p-3">
            <div className="relative w-14 h-14 shrink-0 bg-cream-dark overflow-hidden">
              {product.image_url && (
                <Image src={product.image_url} alt="" fill sizes="56px" className="object-cover" />
              )}
            </div>
            <Link href={`/admin/produits/${product.id}`} className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brown truncate">{product.name}</p>
              <p className="text-xs text-warm-gray truncate">
                {product.category?.name ?? "—"} · <span className="font-bold text-brown">{product.price.toFixed(2)} €</span>
              </p>
              <div className="flex gap-1.5 mt-1">
                <span className={`text-[10px] px-1.5 py-0.5 ${product.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {product.is_available ? "Disponible" : "Indisponible"}
                </span>
                {product.is_featured && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-gold/20 text-brown">Mis en avant</span>
                )}
              </div>
            </Link>
            <div className="shrink-0 flex flex-col items-end gap-2">
              <Link href={`/admin/produits/${product.id}`} className="text-xs text-brown underline">
                Modifier
              </Link>
              <DeleteProductButton productId={product.id} />
            </div>
          </div>
        ))}
        {(!products || products.length === 0) && (
          <p className="text-xs text-warm-gray text-center py-10 tracking-wider">Aucun produit.</p>
        )}
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block bg-white border border-brown/10 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-cream-dark border-b border-brown/10">
            <tr>
              {["Nom", "Catégorie", "Prix", "Disponible", "Mis en avant", "Actions"].map((h) => (
                <th key={h} className="text-left text-xs tracking-widest uppercase px-4 py-3 text-warm-gray">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((product: Product) => (
              <tr key={product.id} className="border-b border-brown/5 hover:bg-cream-dark/40">
                <td className="px-4 py-3">
                  <p className="text-xs font-medium text-brown">{product.name}</p>
                  <p className="text-xs text-warm-gray">{product.slug}</p>
                </td>
                <td className="px-4 py-3 text-xs text-warm-gray">
                  {product.category?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs font-bold text-brown">
                  {product.price.toFixed(2)} €
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 ${product.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {product.is_available ? "Oui" : "Non"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 ${product.is_featured ? "bg-gold/20 text-brown" : "bg-gray-100 text-gray-500"}`}>
                    {product.is_featured ? "Oui" : "Non"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/produits/${product.id}`} className="text-xs text-warm-gray hover:text-brown transition-colors">
                      Modifier
                    </Link>
                    <DeleteProductButton productId={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!products || products.length === 0) && (
          <p className="text-xs text-warm-gray text-center py-10 tracking-wider">
            Aucun produit. <Link href="/admin/produits/nouveau" className="text-brown underline">Ajouter le premier</Link>
          </p>
        )}
      </div>
    </div>
  );
}
