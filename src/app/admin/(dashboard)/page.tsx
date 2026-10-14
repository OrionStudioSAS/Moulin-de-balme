import { parisToday } from "@/lib/bo/dates";
import { exigerUtilisateur } from "@/lib/bo/session";
import { depuisCompte } from "@/lib/bo/user";
import { getCommandes, getProduits } from "@/lib/contenu/donnees";
import DashboardView from "@/components/bo/dashboard/DashboardView";

export default async function AdminDashboard() {
  const [compte, orders, produits] = await Promise.all([exigerUtilisateur(), getCommandes().catch(() => []), getProduits()]);
  return (
    <DashboardView
      user={depuisCompte(compte)}
      orders={orders}
      productsCount={produits.length}
      semaine={produits.filter((p) => p.is_semaine).map((p) => ({ id: p.id, available_days: p.available_days }))}
      today={parisToday()}
    />
  );
}
