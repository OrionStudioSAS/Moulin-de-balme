/**
 * Jeton de session de l'admin, sans base de données : un cookie signé (HMAC-SHA256)
 * qui porte l'e-mail et l'échéance. Web Crypto uniquement, car il est lu à la fois par
 * le middleware (runtime Edge) et par les pages et actions (Node).
 */
export const COOKIE_SESSION = "bo_session";
export const DUREE_SESSION_S = 60 * 60 * 24 * 7;

type Charge = { email: string; exp: number };

function secret(): string | null {
  const valeur = process.env.ADMIN_SECRET_SESSION;
  if (valeur && valeur.length >= 32) return valeur;
  // En local seulement, une clé fixe évite d'avoir à en générer une.
  return process.env.NODE_ENV === "development" ? "developpement-local-uniquement-0000" : null;
}

const encodeur = new TextEncoder();

function base64url(octets: ArrayBuffer | Uint8Array): string {
  const tableau = octets instanceof Uint8Array ? octets : new Uint8Array(octets);
  let binaire = "";
  for (let i = 0; i < tableau.length; i++) binaire += String.fromCharCode(tableau[i]);
  return btoa(binaire).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function depuisBase64url(texte: string): string {
  const b64 = texte.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((texte.length + 3) % 4);
  const binaire = atob(b64);
  return new TextDecoder().decode(Uint8Array.from(binaire, (c) => c.charCodeAt(0)));
}

async function signer(donnees: string, cle: string) {
  const k = await crypto.subtle.importKey("raw", encodeur.encode(cle), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64url(await crypto.subtle.sign("HMAC", k, encodeur.encode(donnees)));
}

/** Comparaison en temps constant de deux chaînes de même nature. */
function egal(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function creerJeton(email: string): Promise<string> {
  const cle = secret();
  if (!cle) throw new Error("ADMIN_SECRET_SESSION manquante (32 caractères minimum).");
  const charge: Charge = { email, exp: Math.floor(Date.now() / 1000) + DUREE_SESSION_S };
  const donnees = base64url(encodeur.encode(JSON.stringify(charge)));
  return `${donnees}.${await signer(donnees, cle)}`;
}

/** E-mail porté par un jeton valide et non expiré, sinon null. */
export async function lireJeton(jeton: string | undefined): Promise<string | null> {
  const cle = secret();
  if (!jeton || !cle) return null;
  const [donnees, signature] = jeton.split(".");
  if (!donnees || !signature) return null;
  if (!egal(await signer(donnees, cle), signature)) return null;
  try {
    const charge = JSON.parse(depuisBase64url(donnees)) as Charge;
    if (typeof charge.email !== "string" || charge.exp * 1000 < Date.now()) return null;
    return charge.email;
  } catch {
    return null;
  }
}
