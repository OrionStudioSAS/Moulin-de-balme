import { NextResponse, type NextRequest } from "next/server";
import { commiter } from "@/lib/contenu/depot";
import { DOSSIER_FICHIERS } from "@/lib/contenu/stockage";
import { getUtilisateur } from "@/lib/bo/session";

const EXTENSIONS: Record<string, string> = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png", "image/avif": "avif" };
// Vercel refuse les requêtes de plus de 4,5 Mo ; l'admin compresse les images avant l'envoi.
const MAX = 4 * 1024 * 1024;

/** Dépose une image dans contenu/fichiers/ (un commit) et renvoie son adresse /fichiers/… */
export async function POST(request: NextRequest) {
  if (!(await getUtilisateur())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const fichier = (await request.formData().catch(() => null))?.get("fichier");
  if (!(fichier instanceof File)) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  const extension = EXTENSIONS[fichier.type];
  if (!extension) return NextResponse.json({ error: "type" }, { status: 400 });
  if (fichier.size > MAX) return NextResponse.json({ error: "taille" }, { status: 413 });

  const nom = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
  try {
    const contenu = new Uint8Array(await fichier.arrayBuffer());
    await commiter("site", `Admin : image ${nom}`, async () => [{ chemin: `${DOSSIER_FICHIERS}/${nom}`, contenu }]);
  } catch (erreur) {
    console.error("Dépôt de l'image impossible", erreur);
    return NextResponse.json({ error: "serveur" }, { status: 500 });
  }
  return NextResponse.json({ url: `/fichiers/${nom}` });
}
