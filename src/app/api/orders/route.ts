import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer_name, customer_email, customer_phone, pickup_date, pickup_time, notes, items, total_amount } = body;

    // Insert order in Supabase
    const supabase = await createClient();
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        customer_name,
        customer_email,
        customer_phone,
        pickup_date,
        pickup_time,
        notes,
        items,
        total_amount,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send notification email
    const notifEmail = process.env.NOTIFICATION_EMAIL;
    if (notifEmail && process.env.RESEND_API_KEY) {
      const itemsHtml = items
        .map(
          (item: { product_name: string; quantity: number; unit_price: number }) =>
            `<tr>
              <td style="padding:8px 12px;border-bottom:1px solid #e5ddd0;font-size:13px;">${item.product_name}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #e5ddd0;font-size:13px;text-align:center;">${item.quantity}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #e5ddd0;font-size:13px;text-align:right;">${(item.unit_price * item.quantity).toFixed(2).replace(".", ",")} €</td>
            </tr>`
        )
        .join("");

      await resend.emails.send({
        from: "Le Moulin de Balme <commandes@moulin-de-balme.fr>",
        to: notifEmail,
        subject: `🥖 Nouvelle commande — ${customer_name} — retrait le ${pickup_date} à ${pickup_time}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#F5F0E8;padding:32px;">
            <h1 style="font-size:20px;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;color:#3D2B1F;margin:0 0 24px;">
              Nouvelle commande Click &amp; Collect
            </h1>

            <div style="background:#fff;border:1px solid #e5ddd0;padding:20px 24px;margin-bottom:20px;">
              <h2 style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.2em;color:#3D2B1F;margin:0 0 12px;">Client</h2>
              <p style="margin:4px 0;font-size:14px;color:#3D2B1F;"><strong>${customer_name}</strong></p>
              <p style="margin:4px 0;font-size:13px;color:#6B5744;"><a href="mailto:${customer_email}" style="color:#C9A96E;">${customer_email}</a></p>
              <p style="margin:4px 0;font-size:13px;color:#6B5744;">${customer_phone}</p>
            </div>

            <div style="background:#fff;border:1px solid #e5ddd0;padding:20px 24px;margin-bottom:20px;">
              <h2 style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.2em;color:#3D2B1F;margin:0 0 12px;">Retrait</h2>
              <p style="margin:4px 0;font-size:14px;color:#3D2B1F;"><strong>${pickup_date}</strong> à <strong>${pickup_time}</strong></p>
              ${notes ? `<p style="margin:12px 0 0;font-size:13px;color:#6B5744;">Notes : ${notes}</p>` : ""}
            </div>

            <div style="background:#fff;border:1px solid #e5ddd0;padding:20px 24px;margin-bottom:20px;">
              <h2 style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.2em;color:#3D2B1F;margin:0 0 12px;">Articles</h2>
              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr style="background:#F5F0E8;">
                    <th style="padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;text-align:left;color:#6B5744;">Produit</th>
                    <th style="padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;text-align:center;color:#6B5744;">Qté</th>
                    <th style="padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;text-align:right;color:#6B5744;">Total</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding:12px;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:0.05em;color:#3D2B1F;text-align:right;">Total</td>
                    <td style="padding:12px;font-size:15px;font-weight:bold;color:#3D2B1F;text-align:right;">${total_amount.toFixed(2).replace(".", ",")} €</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <p style="font-size:11px;color:#9B8A7A;text-align:center;margin-top:24px;">
              Le Moulin de Balme — 7 avenue Alsace-Lorraine, Brive-la-Gaillarde
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("Order API error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
