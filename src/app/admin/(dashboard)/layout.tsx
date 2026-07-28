import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-cream-dark flex">
      {/* Sidebar */}
      <aside className="w-56 bg-brown text-cream flex flex-col">
        <div className="p-6 border-b border-cream/10">
          <p className="text-xs font-bold tracking-widests uppercase text-gold">
            Le Moulin de Balme
          </p>
          <p className="text-xs text-cream/50 mt-1">Administration</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { label: "Tableau de bord", href: "/admin" },
            { label: "Produits", href: "/admin/produits" },
            { label: "Catégories", href: "/admin/categories" },
            { label: "La Semaine", href: "/admin/la-semaine" },
            { label: "Recettes", href: "/admin/recettes" },
            { label: "Commandes", href: "/admin/commandes" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block text-xs tracking-widests uppercase px-3 py-2 text-cream/70 hover:text-cream hover:bg-cream/10 transition-colors rounded"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-cream/10">
          <form action="/api/auth/signout" method="post">
            <button className="text-xs tracking-widests uppercase text-cream/50 hover:text-cream transition-colors">
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
