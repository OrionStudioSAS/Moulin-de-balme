import { createServer } from "node:http";

const host = "127.0.0.1";
const port = 54321;

const farinesCategory = {
  id: "category-farines",
  name: "Farines",
  slug: "farines",
  description: null,
  image_url: null,
  banner_image_url: "/images/hero-banner.png",
  banner_title: "Nos farines",
  banner_subtitle: "Du grain à la farine",
  banner_description: "Données de test locales pour la couverture Playwright T16.",
  sort_order: 1,
  created_at: "2026-08-12T00:00:00.000Z",
};

const painsCategory = {
  ...farinesCategory,
  id: "category-pains",
  name: "Pains",
  slug: "pains",
  banner_title: "Nos pains",
  sort_order: 2,
};

function productFixture(index, category = farinesCategory) {
  return {
    id: `product-${category.slug}-${index}`,
    name: `${category.name} fixture ${index}`,
    slug: `${category.slug}-fixture-${index}`,
    description: "Fixture locale Playwright.",
    subtitle: null,
    price: 4 + index / 10,
    image_url: index === 1 ? "/images/hero-banner.png" : null,
    category_id: category.id,
    available_days: [],
    is_available: true,
    is_featured: false,
    is_semaine: false,
    badge: index === 2 ? "nouveau" : null,
    variations: [],
    ingredients: null,
    conservation: null,
    savoir_faire: null,
    le_saviez_vous: null,
    subcategory_id: null,
    sort_order: index,
    poids: index === 1 ? "1000" : null,
    is_tranche: false,
    weight_prices:
      index === 1
        ? [
            { weight: "500g", price: 3.2 },
            { weight: "1kg", price: 5.8 },
          ]
        : [],
    created_at: "2026-08-12T00:00:00.000Z",
    category,
    subcategory: null,
  };
}

const products = [
  ...Array.from({ length: 8 }, (_, index) => productFixture(index + 1)),
  productFixture(1, painsCategory),
];

function filterProducts(url) {
  let result = products;
  const slug = url.searchParams.get("slug")?.replace(/^eq\./, "");
  const categoryId = url.searchParams.get("category_id")?.replace(/^eq\./, "");
  const excludedSlug = url.searchParams.get("slug")?.replace(/^neq\./, "");

  if (slug && url.searchParams.get("slug")?.startsWith("eq.")) {
    result = result.filter((product) => product.slug === slug);
  }
  if (categoryId) result = result.filter((product) => product.category_id === categoryId);
  if (excludedSlug && url.searchParams.get("slug")?.startsWith("neq.")) {
    result = result.filter((product) => product.slug !== excludedSlug);
  }

  const limit = Number(url.searchParams.get("limit"));
  return Number.isFinite(limit) && limit > 0 ? result.slice(0, limit) : result;
}

createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  response.setHeader("Content-Type", "application/json");

  if (request.method === "OPTIONS") {
    response.writeHead(204).end();
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405).end(JSON.stringify({ message: "Read-only mock" }));
    return;
  }

  if (request.url === "/health") {
    response.writeHead(200).end(JSON.stringify({ status: "ok" }));
    return;
  }

  const url = new URL(request.url ?? "/", `http://${host}:${port}`);
  const wantsSingleObject = request.headers.accept?.includes("application/vnd.pgrst.object+json");
  let data = [];

  if (url.pathname === "/rest/v1/categories") {
    data = [farinesCategory, painsCategory];
  } else if (url.pathname === "/rest/v1/subcategories") {
    data = [];
  } else if (url.pathname === "/rest/v1/products") {
    data = filterProducts(url);
  } else if (url.pathname === "/rest/v1/site_settings") {
    data = [
      {
        value: {
          title: "Nos Produits",
          subtitle: "Façonnés à la main, cuits au four.",
          description: "Données de test locales pour la couverture Playwright.",
          banner_image_url: "/images/hero-banner.png",
        },
      },
    ];
  }

  response.writeHead(200).end(JSON.stringify(wantsSingleObject ? (data[0] ?? null) : data));
}).listen(port, host);
