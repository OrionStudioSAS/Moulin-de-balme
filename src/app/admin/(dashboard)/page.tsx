import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: productsCount },
    { count: ordersCount },
    { count: pendingCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Produits", value: productsCount ?? 0, href: "/admin/produits" },
    { label: "Commandes totales", value: ordersCount ?? 0, href: "/admin/commandes" },
    { label: "En attente", value: pendingCount ?? 0, href: "/admin/commandes?status=pending" },
  ];

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-xl font-bold tracking-widest uppercase text-brown mb-6 md:mb-8">
        Tableau de bord
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 md:mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white p-3 md:p-6 border border-brown/10 hover:border-brown/30 transition-colors">
            <p className="label-tag mb-2 leading-tight">{s.label}</p>
            <p className="text-2xl md:text-3xl font-bold text-brown">{s.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold tracking-widest uppercase text-brown">
            Commandes récentes
          </h2>
          <Link href="/admin/commandes" className="label-tag hover:text-brown transition-colors">
            Voir tout →
          </Link>
        </div>

        <div className="md:hidden bg-white border border-brown/10 divide-y divide-brown/10">
          {(recentOrders ?? []).map((order) => (
            <Link key={order.id} href="/admin/commandes" className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm text-brown truncate">{order.customer_name}</p>
                <p className="text-xs text-warm-gray">
                  {order.pickup_date} · {order.pickup_time} ·{" "}
                  <span className="font-bold text-brown">{Number(order.total_amount).toFixed(2)} €</span>
                </p>
              </div>
              <StatusBadge status={order.status} />
            </Link>
          ))}
          {(!recentOrders || recentOrders.length === 0) && (
            <p className="text-xs text-warm-gray text-center py-8 tracking-wider">Aucune commande pour le moment.</p>
          )}
        </div>

        <div className="hidden md:block bg-white border border-brown/10 overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-cream-dark border-b border-brown/10">
              <tr>
                {["Client", "Date retrait", "Heure", "Total", "Statut"].map((h) => (
                  <th key={h} className="text-left text-xs tracking-widest uppercase px-4 py-3 text-warm-gray">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(recentOrders ?? []).map((order) => (
                <tr key={order.id} className="border-b border-brown/5 hover:bg-cream-dark/50">
                  <td className="px-4 py-3 text-xs text-brown">{order.customer_name}</td>
                  <td className="px-4 py-3 text-xs text-warm-gray">{order.pickup_date}</td>
                  <td className="px-4 py-3 text-xs text-warm-gray">{order.pickup_time}</td>
                  <td className="px-4 py-3 text-xs font-bold text-brown">{Number(order.total_amount).toFixed(2)} €</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!recentOrders || recentOrders.length === 0) && (
            <p className="text-xs text-warm-gray text-center py-8 tracking-wider">
              Aucune commande pour le moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-gold/20 text-brown",
    confirmed: "bg-blue-100 text-blue-800",
    ready: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-800",
  };
  const labels: Record<string, string> = {
    pending: "En attente",
    confirmed: "Confirmé",
    ready: "Prêt",
    completed: "Complété",
    cancelled: "Annulé",
  };
  return (
    <span className={`text-xs tracking-wider px-2 py-1 ${map[status] ?? "bg-gray-100"}`}>
      {labels[status] ?? status}
    </span>
  );
}
