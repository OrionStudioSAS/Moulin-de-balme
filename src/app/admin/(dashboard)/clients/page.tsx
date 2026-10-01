import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { groupCustomers } from "@/lib/bo/customers";
import type { Order } from "@/types";
import CustomersView from "@/components/bo/customers/CustomersView";

export const metadata: Metadata = { title: "Clients" };

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("orders").select("*");
  return <CustomersView customers={groupCustomers((data ?? []) as Order[])} />;
}
