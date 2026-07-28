import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types";
import CategoryImageForm from "@/components/admin/CategoryImageForm";

export default async function CategoriesAdminPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-brown tracking-tight mb-1">Catégories</h1>
      <p className="text-sm text-warm-gray mb-8">
        Gérez les images affichées dans la section &quot;Nos produits&quot; de la homepage.
      </p>

      <div className="space-y-4">
        {(categories ?? []).map((cat: Category) => (
          <CategoryImageForm key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}
