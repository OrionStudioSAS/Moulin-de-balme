import { createClient } from "@/lib/supabase/server";
import { parisToday } from "@/lib/bo/dates";
import type { Order, Product } from "@/types";
import DashboardView from "@/components/bo/dashboard/DashboardView";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [{ data: { user } }, { data: orders }, { count: productsCount }, { data: semaine }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("orders").select("*"),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id, available_days").eq("is_semaine", true),
  ]);

  return (
    <DashboardView
      user={user}
      orders={(orders ?? []) as Order[]}
      productsCount={productsCount ?? 0}
      semaine={(semaine ?? []) as Pick<Product, "id" | "available_days">[]}
      today={parisToday()}
    />
  );
}
