import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { groupCustomers } from "@/lib/bo/customers";
import type { Order } from "@/types";
import CustomerDetail from "@/components/bo/customers/CustomerDetail";

export const metadata: Metadata = { title: "Client" };

export default async function ClientPage({ params }: { params: { email: string } }) {
  const email = decodeURIComponent(params.email).toLowerCase();
  const supabase = await createClient();
  const { data } = await supabase.from("orders").select("*").ilike("customer_email", email);
  const customer = groupCustomers((data ?? []) as Order[]).find((c) => c.key === email);
  if (!customer) notFound();
  return <CustomerDetail customer={customer} />;
}
