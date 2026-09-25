import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

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
      <AdminSidebar />
      {/* Décalage top sur mobile pour la barre fixe */}
      <div className="flex-1 overflow-auto pt-14 lg:pt-0">{children}</div>
    </div>
  );
}
