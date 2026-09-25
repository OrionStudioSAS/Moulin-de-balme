import { createClient } from "@/lib/supabase/server";

const SITE_URL = "https://www.moulin-de-balme.fr";

export async function GET() {
  const supabase = await createClient();
  const { data: recipes } = await supabase
    .from("recipes")
    .select("title, slug, excerpt, image_url, published_at, tags")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(20);

  const items = (recipes ?? [])
    .map((r) => {
      const url = `${SITE_URL}/recettes/${r.slug}`;
      const date = r.published_at ? new Date(r.published_at).toUTCString() : new Date().toUTCString();
      const desc = r.excerpt ?? `Recette artisanale du Moulin de Balme, boulangerie à Brive-la-Gaillarde.`;
      const image = r.image_url ? `<enclosure url="${r.image_url}" type="image/jpeg" length="0" />` : "";
      return `
    <item>
      <title><![CDATA[${r.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${desc}]]></description>
      <pubDate>${date}</pubDate>
      ${image}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Le Moulin de Balme — Recettes</title>
    <link>${SITE_URL}/recettes</link>
    <description>Recettes artisanales de Stéphane Reinat, Maître Boulanger à Brive-la-Gaillarde.</description>
    <language>fr-FR</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/images/logo.png</url>
      <title>Le Moulin de Balme</title>
      <link>${SITE_URL}</link>
    </image>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
