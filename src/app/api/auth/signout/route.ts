import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESSION } from "@/lib/bo/jeton";

export async function POST(request: NextRequest) {
  const reponse = NextResponse.redirect(new URL("/admin/login", request.url), { status: 303 });
  reponse.cookies.delete({ name: COOKIE_SESSION, path: "/" });
  return reponse;
}
