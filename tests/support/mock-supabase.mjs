import { createServer } from "node:http";

const host = "127.0.0.1";
const port = 54321;
const writes = [];

const category = {
  id: "category-breads",
  name: "Pains",
  slug: "pains",
  description: null,
  image_url: null,
  banner_image_url: null,
  banner_title: null,
  banner_subtitle: null,
  banner_description: null,
  sort_order: 1,
  created_at: "2026-01-01T00:00:00Z",
};

function product(id, name, sortOrder, categoryId = category.id) {
  return {
    id,
    name,
    slug: id,
    description: null,
    subtitle: null,
    price: 4 + sortOrder,
    image_url: null,
    category_id: categoryId,
    available_days: [],
    is_available: true,
    is_featured: false,
    is_semaine: false,
    badge: null,
    variations: [],
    ingredients: null,
    conservation: null,
    savoir_faire: null,
    le_saviez_vous: null,
    subcategory_id: null,
    sort_order: sortOrder,
    poids: "500",
    is_tranche: false,
    weight_prices: [],
    created_at: "2026-01-01T00:00:00Z",
    category,
    subcategory: null,
  };
}

const products = [
  product("pain-source", "Pain de campagne", 1),
  product("pain-noix", "Pain aux noix", 2),
  product("pain-seigle", "Pain de seigle", 3),
  product("pain-complet", "Pain complet", 4),
  product("brioche", "Brioche", 5, "category-pastries"),
];

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
    writes.push({ method: request.method, url: request.url });
    response.writeHead(405).end(JSON.stringify({ message: "Read-only mock" }));
    return;
  }

  if (request.url === "/health") {
    response.writeHead(200).end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (request.url === "/requests") {
    response.writeHead(200).end(JSON.stringify({ writes }));
    return;
  }

  if (request.url?.startsWith("/rest/v1/products")) {
    response.writeHead(200).end(JSON.stringify(products));
    return;
  }

  if (request.url?.startsWith("/rest/v1/categories")) {
    response.writeHead(200).end(JSON.stringify([category]));
    return;
  }

  const wantsSingleObject = request.headers.accept?.includes("application/vnd.pgrst.object+json");
  response.writeHead(200).end(JSON.stringify(wantsSingleObject ? {} : []));
}).listen(port, host);
