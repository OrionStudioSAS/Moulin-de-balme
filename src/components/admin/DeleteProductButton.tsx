"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Supprimer ce produit ?")) return;
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", productId);
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-500 hover:text-red-700 transition-colors"
    >
      Supprimer
    </button>
  );
}
