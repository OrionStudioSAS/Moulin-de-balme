import { Fragment } from "react";
import { createClient } from "@/lib/supabase/server";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import type { Order } from "@/types";

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  ready: "Prêt",
  completed: "Complété",
  cancelled: "Annulé",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gold/20 text-brown",
  confirmed: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-800",
};

function formatPrice(value: number) {
  return Number(value || 0).toFixed(2).replace(".", ",");
}

function orderItems(order: Order) {
  return Array.isArray(order.items) ? order.items : [];
}

export default async function CommandesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; date?: string }>;
}) {
  const { status, date } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  if (date) query = query.eq("pickup_date", date);

  const { data: orders } = await query;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold tracking-widests uppercase text-brown">
          Commandes Click &amp; Collect
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[undefined, "pending", "confirmed", "ready", "completed", "cancelled"].map((s) => (
          <a
            key={s ?? "all"}
            href={s ? `/admin/commandes?status=${s}` : "/admin/commandes"}
            className={`text-xs tracking-widests uppercase px-4 py-2 border transition-colors ${
              status === s || (!status && !s)
                ? "border-brown bg-brown text-cream"
                : "border-brown/30 text-brown/60 hover:border-brown hover:text-brown"
            }`}
          >
            {s ? STATUS_LABELS[s] : "Toutes"}
          </a>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-brown/10 overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-cream-dark border-b border-brown/10">
            <tr>
              {["Client", "Email", "Téléphone", "Retrait", "Heure", "Total", "Statut", "Actions"].map((h) => (
                <th key={h} className="text-left text-xs tracking-widests uppercase px-4 py-3 text-warm-gray">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((order: Order) => {
              const items = orderItems(order);
              return (
                <Fragment key={order.id}>
                  <tr key={order.id} className="border-b border-brown/5 hover:bg-cream-dark/40">
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-brown">{order.customer_name}</p>
                      <p className="text-xs text-warm-gray mt-0.5">
                        {items.length} article{items.length > 1 ? "s" : ""}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-warm-gray">{order.customer_email}</td>
                    <td className="px-4 py-3 text-xs text-warm-gray">{order.customer_phone}</td>
                    <td className="px-4 py-3 text-xs text-warm-gray">{order.pickup_date}</td>
                    <td className="px-4 py-3 text-xs text-warm-gray">{order.pickup_time}</td>
                    <td className="px-4 py-3 text-xs font-bold text-brown">
                      {formatPrice(Number(order.total_amount))} €
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs tracking-wider px-2 py-1 ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                    </td>
                  </tr>
                  <tr key={`${order.id}-details`} className="border-b border-brown/10 bg-cream/40">
                    <td colSpan={8} className="px-4 py-4">
                      <details className="group">
                        <summary className="cursor-pointer list-none text-[11px] font-bold uppercase tracking-widest text-brown hover:opacity-70">
                          <span className="inline-block transition-transform group-open:rotate-90">›</span>{" "}
                          Détail de la commande
                        </summary>
                        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_280px]">
                          <div className="overflow-hidden border border-brown/10 bg-white">
                            <table className="w-full min-w-[520px]">
                              <thead className="bg-cream-dark">
                                <tr>
                                  {["Produit", "Quantité", "Prix unitaire", "Total"].map((h) => (
                                    <th key={h} className="px-3 py-2 text-left text-[10px] uppercase tracking-widest text-warm-gray">
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {items.length > 0 ? (
                                  items.map((item, index) => (
                                    <tr key={`${order.id}-${item.product_id}-${index}`} className="border-t border-brown/5">
                                      <td className="px-3 py-2 text-xs font-medium text-brown">{item.product_name}</td>
                                      <td className="px-3 py-2 text-xs text-warm-gray">× {item.quantity}</td>
                                      <td className="px-3 py-2 text-xs text-warm-gray">{formatPrice(item.unit_price)} €</td>
                                      <td className="px-3 py-2 text-xs font-bold text-brown">
                                        {formatPrice(item.unit_price * item.quantity)} €
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={4} className="px-3 py-5 text-center text-xs text-warm-gray">
                                      Aucun détail produit enregistré.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          <div className="border border-brown/10 bg-white p-4">
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-warm-gray">
                              Notes client
                            </p>
                            <p className="text-xs leading-relaxed text-brown/70">
                              {order.notes?.trim() || "Aucune note pour cette commande."}
                            </p>
                          </div>
                        </div>
                      </details>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
        {(!orders || orders.length === 0) && (
          <p className="text-xs text-warm-gray text-center py-10 tracking-wider">
            Aucune commande trouvée.
          </p>
        )}
      </div>
    </div>
  );
}
