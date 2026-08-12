import { createServer } from "node:http";

const host = "127.0.0.1";
const port = 54321;

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

  const wantsSingleObject = request.headers.accept?.includes("application/vnd.pgrst.object+json");
  response.writeHead(200).end(JSON.stringify(wantsSingleObject ? {} : []));
}).listen(port, host);
