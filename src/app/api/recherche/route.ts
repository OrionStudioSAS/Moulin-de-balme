import { NextResponse, type NextRequest } from "next/server";
import { getProduits } from "@/lib/contenu/donnees";

const normaliser = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Recherche de produits disponibles par nom (6 résultats max), pour la loupe du site. */
export async function GET(request: NextRequest) {
  const q = normaliser(request.nextUrl.searchParams.get("q")?.trim() ?? "");
  if (!q) return NextResponse.json([]);
  const produits = (await getProduits({ disponibles: true })).filter((p) => normaliser(p.name).includes(q)).slice(0, 6);
  return NextResponse.json(produits);
}
