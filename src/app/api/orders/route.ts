import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { commiter } from "@/lib/contenu/depot";
import { fichiers, lireDans, tagContenu, versJson } from "@/lib/contenu/stockage";
import type { Order } from "@/types";
import { Resend } from "resend";
import { isValidPickup } from "@/lib/pickup";

// Créé à la demande : sans clé (build, préversions), le constructeur lève une erreur.
const resend = () => new Resend(process.env.RESEND_API_KEY);

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer_name, customer_email, pickup_date, pickup_time, notes, items, total_amount } = body;

    if (!isValidPickup(pickup_date, pickup_time)) {
      return NextResponse.json(
        { error: "Ce créneau de retrait n'est plus disponible. Merci d'en choisir un autre." },
        { status: 400 }
      );
    }

    const order: Order = {
      id: crypto.randomUUID(),
      customer_name: String(customer_name ?? "").trim(),
      customer_email: String(customer_email ?? "").trim(),
      customer_phone: "",
      pickup_date,
      pickup_time,
      notes: notes ? String(notes) : null,
      items: Array.isArray(items) ? items : [],
      total_amount: Number(total_amount) || 0,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    if (!order.customer_name || !order.customer_email || order.items.length === 0) {
      return NextResponse.json({ error: "Commande incomplète." }, { status: 400 });
    }

    // Enregistrement dans le dépôt privé des commandes (un commit par commande)
    try {
      await commiter("commandes", `Nouvelle commande — retrait le ${pickup_date}`, async (lire) => {
        const commandes = await lireDans(lire, "commandes");
        return [{ chemin: fichiers.commandes.chemin, contenu: versJson([...commandes, order]) }];
      });
      revalidateTag(tagContenu("commandes"));
    } catch (erreur) {
      console.error("Enregistrement de la commande impossible", erreur);
      return NextResponse.json({ error: "Impossible d'enregistrer la commande. Merci de réessayer." }, { status: 500 });
    }

    const from = process.env.RESEND_FROM_EMAIL ?? "Le Moulin de Balme <onboarding@resend.dev>";
    const itemsHtml = buildItemsHtml(items);

    if (process.env.RESEND_API_KEY) {
      await Promise.all([
        // ── 1. Notification interne ──
        process.env.NOTIFICATION_EMAIL
          ? resend().emails.send({
              from,
              to: process.env.NOTIFICATION_EMAIL,
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
                          <td colspan="2" style="padding:12px;font-size:13px;font-weight:bold;color:#3D2B1F;text-align:right;">Total</td>
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
            })
          : Promise.resolve(),

        // ── 2. Confirmation client ──
        resend().emails.send({
          from,
          to: customer_email,
          subject: `Votre commande Click & Collect est confirmée — Le Moulin de Balme`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#F5F0E8;padding:32px;">
              <h1 style="font-size:20px;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;color:#3D2B1F;margin:0 0 8px;">
                Merci ${customer_name} !
              </h1>
              <p style="font-size:14px;color:#6B5744;margin:0 0 28px;">
                Votre commande Click &amp; Collect a bien été enregistrée.
              </p>

              <div style="background:#3D2B1F;padding:20px 24px;margin-bottom:20px;">
                <h2 style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.2em;color:#C9A96E;margin:0 0 10px;">Votre retrait</h2>
                <p style="font-size:18px;font-weight:bold;color:#fff;margin:0;">
                  ${pickup_date} à ${pickup_time}
                </p>
                <p style="font-size:13px;color:#fff;opacity:0.7;margin:6px 0 0;">
                  7 avenue Alsace-Lorraine, 19100 Brive-la-Gaillarde
                </p>
              </div>

              <div style="background:#fff;border:1px solid #e5ddd0;padding:20px 24px;margin-bottom:20px;">
                <h2 style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.2em;color:#3D2B1F;margin:0 0 12px;">Récapitulatif</h2>
                <table style="width:100%;border-collapse:collapse;">
                  <tbody>${itemsHtml}</tbody>
                  <tfoot>
                    <tr>
                      <td colspan="2" style="padding:12px 12px 4px;font-size:13px;font-weight:bold;color:#3D2B1F;text-align:right;">Total à régler en boutique</td>
                      <td style="padding:12px 12px 4px;font-size:15px;font-weight:bold;color:#3D2B1F;text-align:right;">${total_amount.toFixed(2).replace(".", ",")} €</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              ${notes ? `<div style="background:#fff;border:1px solid #e5ddd0;padding:16px 24px;margin-bottom:20px;"><p style="font-size:13px;color:#6B5744;margin:0;">Notes : ${notes}</p></div>` : ""}

              <p style="font-size:13px;color:#6B5744;line-height:1.6;margin-bottom:24px;">
                Le paiement s&apos;effectue directement en boutique lors du retrait.<br />
                Pour toute question, contactez-nous à
                <a href="mailto:moulindebalme@gmail.com" style="color:#C9A96E;">moulindebalme@gmail.com</a>.
              </p>

              <p style="font-size:11px;color:#9B8A7A;text-align:center;border-top:1px solid #e5ddd0;padding-top:20px;margin:0;">
                Le Moulin de Balme — 7 avenue Alsace-Lorraine, 19100 Brive-la-Gaillarde
              </p>
            </div>
          `,
        }),
      ]);
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("Order API error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
