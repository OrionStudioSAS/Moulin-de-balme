import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { groupCustomers } from "@/lib/bo/customers";
import { getCommandes } from "@/lib/contenu/donnees";
import CustomerDetail from "@/components/bo/customers/CustomerDetail";

export const metadata: Metadata = { title: "Client" };

export default async function ClientPage({ params }: { params: { email: string } }) {
  const email = decodeURIComponent(params.email).toLowerCase();
  const customer = groupCustomers(await getCommandes()).find((c) => c.key === email);
  if (!customer) notFound();
  return <CustomerDetail customer={customer} />;
}
