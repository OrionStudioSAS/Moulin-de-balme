import { readFile } from "node:fs/promises";
import path from "node:path";
import { depotConfigure, lireBinaire } from "@/lib/contenu/depot";
import { DOSSIER_FICHIERS } from "@/lib/contenu/stockage";

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

/**
 * Images déposées depuis l'admin, stockées dans contenu/fichiers/ du dépôt. Elles sont
 * lues sur GitHub, donc en ligne dès le commit, sans redéploiement ; la copie embarquée
 * au build sert de secours. Les noms étant horodatés, un fichier ne change jamais :
 * le CDN le garde aussi longtemps que possible.
 */
export async function GET(_request: Request, { params }: { params: { chemin: string[] } }) {
  const { chemin } = params;
  const extension = chemin.at(-1)?.split(".").pop()?.toLowerCase() ?? "";

  if (!TYPES[extension] || chemin.some((segment) => !/^[a-z0-9][a-z0-9._-]*$/i.test(segment) || segment.includes(".."))) {
    return new Response("Introuvable", { status: 404 });
  }

  const relatif = `${DOSSIER_FICHIERS}/${chemin.join("/")}`;
  let contenu: ArrayBuffer | Buffer | null = null;

  try {
    contenu = await readFile(path.join(process.cwd(), relatif)).catch(() => null);
    if (!contenu && depotConfigure()) contenu = await lireBinaire("site", relatif);
  } catch (erreur) {
    console.error(`Lecture du fichier ${relatif} impossible`, erreur);
  }

  if (!contenu) return new Response("Introuvable", { status: 404 });

  return new Response(new Uint8Array(contenu), {
    headers: {
      "Content-Type": TYPES[extension],
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
