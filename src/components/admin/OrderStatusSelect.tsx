"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const STATUSES = [
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmé" },
  { value: "ready", label: "Prêt" },
  { value: "completed", label: "Complété" },
  { value: "cancelled", label: "Annulé" },
];

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (newStatus: string) => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    setStatus(newStatus);
    setLoading(false);
  };

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={loading}
      className="text-xs border border-brown/30 px-2 py-1 bg-white text-brown focus:outline-none focus:border-brown disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}
