import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parisToday } from "@/lib/bo/dates";
import { Sidebar } from "@/components/bo/shell/Sidebar";
import { MobileTabBar } from "@/components/bo/shell/MobileNav";
import { ToastProvider } from "@/components/bo/ui/Toast";
import { displayName } from "@/lib/bo/user";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Compteur du menu « Commandes » : en attente + prêtes à retirer aujourd'hui
  const today = parisToday();
  const [{ count: pending }, { count: readyToday }] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "ready").eq("pickup_date", today),
  ]);
  const ordersCount = (pending ?? 0) + (readyToday ?? 0);

  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        <Sidebar userName={displayName(user)} ordersCount={ordersCount} />
        <main className="min-w-0 flex-1 px-4 pb-32 pt-4 lg:px-10 lg:pb-14 lg:pt-8">{children}</main>
        <MobileTabBar ordersCount={ordersCount} />
      </div>
    </ToastProvider>
  );
}
