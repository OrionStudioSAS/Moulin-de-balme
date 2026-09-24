import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderItem = { product_name: string; quantity: number; unit_price: number };

function buildItemsHtml(items: OrderItem[]) {
  return items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5ddd0;font-size:13px;color:#3D2B1F;">${item.product_name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5ddd0;font-size:13px;text-align:center;color:#3D2B1F;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5ddd0;font-size:13px;text-align:right;color:#3D2B1F;">${(item.unit_price * item.quantity).toFixed(2).replace(".", ",")} €</td>
        </tr>`
    )
    .join("");
}

const STATUS_EMAILS: Record<string, { subject: (name: string) => string; body: (order: Record<string, unknown>) => string }> = {
  confirmed: {
    subject: (name) => `✅ Commande confirmée — Le Moulin de Balme`,
    body: (order) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#F5F0E8;padding:32px;">
        <h1 style="font-size:20px;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;color:#3D2B1F;margin:0 0 8px;">
          Commande confirmée !
        </h1>
        <p style="font-size:14px;color:#6B5744;margin:0 0 28px;">
          Bonjour ${order.customer_name}, votre commande a été confirmée par notre équipe.
        </p>
        <div style="background:#3D2B1F;padding:20px 24px;margin-bottom:20px;">
          <h2 style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.2em;color:#C9A96E;margin:0 0 10px;">Votre retrait</h2>
          <p style="font-size:18px;font-weight:bold;color:#fff;margin:0;">${order.pickup_date} à ${order.pickup_time}</p>
          <p style="font-size:13px;color:rgba(255,255,255,0.7);margin:6px 0 0;">7 avenue Alsace-Lorraine, 19100 Brive-la-Gaillarde</p>
        </div>
        <div style="background:#fff;border:1px solid #e5ddd0;padding:20px 24px;margin-bottom:20px;">
          <h2 style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.2em;color:#3D2B1F;margin:0 0 12px;">Récapitulatif</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tbody>${buildItemsHtml(order.items as OrderItem[])}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:12px;font-size:13px;font-weight:bold;color:#3D2B1F;text-align:right;">Total à régler en boutique</td>
                <td style="padding:12px;font-size:15px;font-weight:bold;color:#3D2B1F;text-align:right;">${(order.total_amount as number).toFixed(2).replace(".", ",")} €</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p style="font-size:13px;color:#6B5744;line-height:1.6;margin-bottom:24px;">
          Le paiement s&apos;effectue directement en boutique.<br/>
          Pour toute question : <a href="mailto:commandes@moulin-de-balme.fr" style="color:#C9A96E;">commandes@moulin-de-balme.fr</a>
        </p>
        <p style="font-size:11px;color:#9B8A7A;text-align:center;border-top:1px solid #e5ddd0;padding-top:20px;margin:0;">
          Le Moulin de Balme — 7 avenue Alsace-Lorraine, 19100 Brive-la-Gaillarde
        </p>
      </div>
    `,
  },

  completed: {
    subject: () => `Merci pour votre visite — Le Moulin de Balme`,
    body: (order) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#F5F0E8;padding:32px;">
        <h1 style="font-size:20px;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;color:#3D2B1F;margin:0 0 8px;">
          Merci pour votre visite !
        </h1>
        <p style="font-size:14px;color:#6B5744;margin:0 0 28px;">
          Bonjour ${order.customer_name}, votre commande a bien été récupérée. Merci de votre confiance.
        </p>
        <p style="font-size:14px;color:#6B5744;line-height:1.7;margin-bottom:24px;">
          Nous espérons vous revoir bientôt au Moulin de Balme.<br/>
          N&apos;hésitez pas à passer commande à nouveau directement sur notre site.
        </p>
        <p style="font-size:11px;color:#9B8A7A;text-align:center;border-top:1px solid #e5ddd0;padding-top:20px;margin:0;">
          Le Moulin de Balme — 7 avenue Alsace-Lorraine, 19100 Brive-la-Gaillarde
        </p>
      </div>
    `,
  },

  cancelled: {
    subject: () => `Commande annulée — Le Moulin de Balme`,
    body: (order) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#F5F0E8;padding:32px;">
        <h1 style="font-size:20px;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;color:#3D2B1F;margin:0 0 8px;">
          Commande annulée
        </h1>
        <p style="font-size:14px;color:#6B5744;margin:0 0 28px;">
          Bonjour ${order.customer_name}, nous sommes désolés de vous informer que votre commande du ${order.pickup_date} à ${order.pickup_time} a été annulée.
        </p>
        <p style="font-size:14px;color:#6B5744;line-height:1.7;margin-bottom:24px;">
          Pour toute question ou pour passer une nouvelle commande, contactez-nous à
          <a href="mailto:commandes@moulin-de-balme.fr" style="color:#C9A96E;">commandes@moulin-de-balme.fr</a>.
        </p>
        <p style="font-size:11px;color:#9B8A7A;text-align:center;border-top:1px solid #e5ddd0;padding-top:20px;margin:0;">
          Le Moulin de Balme — 7 avenue Alsace-Lorraine, 19100 Brive-la-Gaillarde
        </p>
      </div>
    `,
  },
};

export async function POST(req: NextRequest) {
  try {
    const { orderId, newStatus } = await req.json();

    const supabase = await createClient();

    // Update status
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Send email if status triggers one
    const emailDef = STATUS_EMAILS[newStatus];
    if (emailDef && process.env.RESEND_API_KEY) {
      const { data: order } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (order?.customer_email) {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? "Le Moulin de Balme <onboarding@resend.dev>",
          to: order.customer_email,
          subject: emailDef.subject(order.customer_name),
          html: emailDef.body(order),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Order status API error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
