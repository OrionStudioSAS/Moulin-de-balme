import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESSION, lireJeton } from "@/lib/bo/jeton";

/**
 * Admin : sans session valide, retour à la connexion. La vérification complète (compte
 * toujours déclaré dans ADMIN_COMPTES) est refaite dans le layout et dans chaque action.
 */
export async function middleware(request: NextRequest) {
  const connecte = (await lireJeton(request.cookies.get(COOKIE_SESSION)?.value)) !== null;
  const chemin = request.nextUrl.pathname;

  if (!connecte && !chemin.startsWith("/admin/login")) {
    if (chemin.startsWith("/api/")) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
