import { parisToday } from "@/lib/bo/dates";
import { exigerUtilisateur } from "@/lib/bo/session";
import { depuisCompte, displayName } from "@/lib/bo/user";
import { getCommandes } from "@/lib/contenu/donnees";
import { Sidebar } from "@/components/bo/shell/Sidebar";
import { MobileTabBar } from "@/components/bo/shell/MobileNav";
import { ToastProvider } from "@/components/bo/ui/Toast";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const compte = await exigerUtilisateur();

  // Compteur du menu « Commandes » : en attente + prêtes à retirer aujourd'hui
  const today = parisToday();
  const commandes = await getCommandes().catch(() => []);
  const ordersCount = commandes.filter((o) => o.status === "pending" || (o.status === "ready" && o.pickup_date === today)).length;

  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        <Sidebar userName={displayName(depuisCompte(compte))} ordersCount={ordersCount} />
        <main className="min-w-0 flex-1 px-4 pb-32 pt-4 lg:px-10 lg:pb-14 lg:pt-8">{children}</main>
        <MobileTabBar ordersCount={ordersCount} />
      </div>
    </ToastProvider>
  );
}
