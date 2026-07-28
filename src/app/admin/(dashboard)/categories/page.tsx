import { createClient } from "@/lib/supabase/server";
import type { Category, Subcategory } from "@/types";
import CategoryForm from "@/components/admin/CategoryForm";
import DefaultBannerForm from "@/components/admin/DefaultBannerForm";

export default async function CategoriesAdminPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: subcategories }, { data: settings }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("subcategories").select("*").order("sort_order"),
    supabase.from("site_settings").select("value").eq("key", "products_banner").single(),
  ]);

  const defaultBanner = (settings?.value ?? {}) as {
    title?: string;
    subtitle?: string;
    description?: string;
    banner_image_url?: string | null;
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-brown tracking-tight mb-1">Catégories</h1>
      <p className="text-sm text-warm-gray mb-8">
        Gérez les images, bannières et sous-catégories de chaque catégorie.
      </p>

      {/* Bannière par défaut "Tous les produits" */}
      <div className="mb-8">
        <h2 className="text-xs font-bold tracking-widest uppercase text-brown mb-3">
          Bannière par défaut — Tous les produits
        </h2>
        <DefaultBannerForm defaultBanner={defaultBanner} />
      </div>

      {/* Une carte par catégorie */}
      <h2 className="text-xs font-bold tracking-widest uppercase text-brown mb-3">
        Catégories
      </h2>
      <div className="space-y-6">
        {(categories ?? []).map((cat: Category) => (
          <CategoryForm
            key={cat.id}
            category={cat}
            subcategories={(subcategories ?? []).filter(
              (s: Subcategory) => s.category_id === cat.id
            )}
          />
        ))}
      </div>
    </div>
  );
}
