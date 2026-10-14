import type { Metadata } from "next";
import { groupCustomers } from "@/lib/bo/customers";
import { getCommandes } from "@/lib/contenu/donnees";
import CustomersView from "@/components/bo/customers/CustomersView";

export const metadata: Metadata = { title: "Clients" };

export default async function ClientsPage() {
  return <CustomersView customers={groupCustomers(await getCommandes())} />;
}
