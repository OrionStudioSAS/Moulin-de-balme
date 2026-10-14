import type { Metadata } from "next";
import { parisToday, weekStart } from "@/lib/bo/dates";
import { getProduits } from "@/lib/contenu/donnees";
import WeekView, { type WeekProduct } from "@/components/bo/week/WeekView";

export const metadata: Metadata = { title: "La semaine" };

export default async function AdminLaSemainePage({ searchParams }: { searchParams: { semaine?: string } }) {
  const today = parisToday();
  const requested = searchParams.semaine && /^\d{4}-\d{2}-\d{2}$/.test(searchParams.semaine) ? searchParams.semaine : today;
  const produits: WeekProduct[] = (await getProduits())
    .map((p) => ({ id: p.id, name: p.name, image_url: p.image_url, available_days: p.available_days ?? [], is_semaine: p.is_semaine, category: p.category ? { name: p.category.name } : null }))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
  return <WeekView products={produits} today={today} monday={weekStart(requested)} />;
}
