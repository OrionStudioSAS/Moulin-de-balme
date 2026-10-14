import type { Metadata } from "next";
import { parisToday } from "@/lib/bo/dates";
import { getCommandes } from "@/lib/contenu/donnees";
import OrdersView from "@/components/bo/orders/OrdersView";

export const metadata: Metadata = { title: "Commandes" };

export default async function CommandesPage() {
  return <OrdersView orders={await getCommandes()} today={parisToday()} />;
}
