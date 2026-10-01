import type { Order } from "@/types";

export type Customer = {
  key: string;
  email: string;
  name: string;
  otherNames: string[];
  orders: Order[];
  ordersCount: number;
  cancelledCount: number;
  spent: number;
  lastPickup: Order | null;
  firstOrderAt: string;
};

const pickupKey = (o: Order) => `${o.pickup_date}T${o.pickup_time ?? "00:00"}`;

/** Un client = les commandes regroupées par email (insensible à la casse). Nom = celui de la commande la plus récente. */
export function groupCustomers(orders: Order[]): Customer[] {
  const map = new Map<string, Order[]>();
  for (const o of orders) {
    const key = (o.customer_email ?? "").trim().toLowerCase();
    if (!key) continue;
    map.set(key, [...(map.get(key) ?? []), o]);
  }

  return Array.from(map, ([key, list]) => {
    const byPickup = [...list].sort((a, b) => pickupKey(b).localeCompare(pickupKey(a)));
    const byCreation = [...list].sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
    const name = byCreation[0].customer_name;
    const otherNames = Array.from(new Set(list.map((o) => o.customer_name.trim()).filter((n) => n && n !== name)));
    return {
      key,
      email: byCreation[0].customer_email,
      name,
      otherNames,
      orders: byPickup,
      ordersCount: list.length,
      cancelledCount: list.filter((o) => o.status === "cancelled").length,
      spent: list.filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.total_amount || 0), 0),
      lastPickup: byPickup[0] ?? null,
      firstOrderAt: byCreation[byCreation.length - 1].created_at,
    };
  }).sort((a, b) => (b.lastPickup ? pickupKey(b.lastPickup) : "").localeCompare(a.lastPickup ? pickupKey(a.lastPickup) : ""));
}
