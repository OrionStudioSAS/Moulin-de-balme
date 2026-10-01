import type { Order, OrderItem } from "@/types";

export type OrderStatus = Order["status"];

/** Slugs d'URL lisibles (?statut=en-attente) ↔ valeurs en base */
export const STATUS_SLUGS: Record<OrderStatus, string> = {
  pending: "en-attente",
  confirmed: "confirmees",
  ready: "pretes",
  completed: "retirees",
  cancelled: "annulees",
};

export function statusFromSlug(slug: string | undefined): OrderStatus | null {
  const entry = Object.entries(STATUS_SLUGS).find(([, s]) => s === slug);
  return entry ? (entry[0] as OrderStatus) : null;
}

/** Action principale du panneau de détail selon le statut */
export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "confirmed",
  confirmed: "ready",
  ready: "completed",
};

export const isClosed = (status: OrderStatus) => status === "completed" || status === "cancelled";

export function orderItems(order: Pick<Order, "items">): OrderItem[] {
  return Array.isArray(order.items) ? order.items : [];
}

export function itemsCount(order: Pick<Order, "items">): number {
  return orderItems(order).reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
}

const key = (o: Pick<Order, "pickup_date" | "pickup_time">) => `${o.pickup_date}T${o.pickup_time ?? "00:00"}`;

/** Retraits à venir (du plus proche au plus lointain), puis retraits passés (du plus récent au plus ancien) */
export function sortByPickup<T extends Pick<Order, "pickup_date" | "pickup_time">>(orders: T[], today: string): T[] {
  const upcoming = orders.filter((o) => o.pickup_date >= today).sort((a, b) => key(a).localeCompare(key(b)));
  const past = orders.filter((o) => o.pickup_date < today).sort((a, b) => key(b).localeCompare(key(a)));
  return [...upcoming, ...past];
}

/** Quantités à préparer, regroupées par produit */
export function aggregateItems(orders: Pick<Order, "items">[]) {
  const map = new Map<string, number>();
  for (const order of orders) {
    for (const item of orderItems(order)) {
      map.set(item.product_name, (map.get(item.product_name) ?? 0) + (Number(item.quantity) || 0));
    }
  }
  return Array.from(map, ([name, quantity]) => ({ name, quantity })).sort((a, b) => b.quantity - a.quantity || a.name.localeCompare(b.name));
}
