import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { parisToday, weekStart } from "@/lib/bo/dates";
import WeekView, { type WeekProduct } from "@/components/bo/week/WeekView";

export const metadata: Metadata = { title: "La semaine" };

export default async function AdminLaSemainePage({ searchParams }: { searchParams: { semaine?: string } }) {
  const supabase = await createClient();
  const today = parisToday();
  const requested = searchParams.semaine && /^\d{4}-\d{2}-\d{2}$/.test(searchParams.semaine) ? searchParams.semaine : today;

  const { data } = await supabase
    .from("products")
    .select("id, name, image_url, available_days, is_semaine, category:categories(name)")
    .order("name");

  return <WeekView products={(data ?? []) as unknown as WeekProduct[]} today={today} monday={weekStart(requested)} />;
}
