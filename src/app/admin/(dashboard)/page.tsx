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
    <div className="p-8">
      <h1 className="text-xl font-bold tracking-widests uppercase text-brown mb-8">
        Tableau de bord
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white p-6 border border-brown/10 hover:border-brown/30 transition-colors">
            <p className="label-tag mb-2">{s.label}</p>
            <p className="text-3xl font-bold text-brown">{s.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold tracking-widests uppercase text-brown">
            Commandes récentes
          </h2>
          <Link href="/admin/commandes" className="label-tag hover:text-brown transition-colors">
            Voir tout →
          </Link>
        </div>

        <div className="bg-white border border-brown/10 overflow-hidden">
          <table className="w-full">
            <thead className="bg-cream-dark border-b border-brown/10">
              <tr>
                {["Client", "Date retrait", "Heure", "Total", "Statut"].map((h) => (
                  <th key={h} className="text-left text-xs tracking-widests uppercase px-4 py-3 text-warm-gray">
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
