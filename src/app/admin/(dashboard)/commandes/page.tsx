import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { parisToday } from "@/lib/bo/dates";
import type { Order } from "@/types";
import OrdersView from "@/components/bo/orders/OrdersView";

export const metadata: Metadata = { title: "Commandes" };

export default async function CommandesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("orders").select("*");
  return <OrdersView orders={(data ?? []) as Order[]} today={parisToday()} />;
}
