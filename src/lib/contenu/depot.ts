import "server-only";

import { execFileSync } from "node:child_process";

/**
 * Dépôts GitHub qui tiennent lieu de base de données (même principe qu'Orion admin
 * et Château l'Arc). Deux dépôts :
 * - « site » : le dépôt public du site, dossier `contenu/` (produits, catégories…) ;
 * - « commandes » : un dépôt privé, car les commandes contiennent des données clients.
 *
 * Variables d'environnement :
 * - GITHUB_TOKEN : jeton « fine-grained » donnant Contents: Read and write sur les deux dépôts.
 *   En développement, à défaut, le jeton de la GitHub CLI (`gh auth token`) est utilisé.
 * - GITHUB_DEPOT / GITHUB_DEPOT_COMMANDES (facultatifs) : « propriétaire/dépôt ».
 * - GITHUB_BRANCHE (facultatif) : branche lue et écrite dans les deux dépôts.
 */
export type Depot = "site" | "commandes";

const DEPOTS: Record<Depot, string> = {
  site: process.env.GITHUB_DEPOT || "OrionStudioSAS/Moulin-de-balme",
  commandes: process.env.GITHUB_DEPOT_COMMANDES || "OrionStudioSAS/moulin-de-balme-commandes",
};
const BRANCHE = process.env.GITHUB_BRANCHE || "main";

let jetonCli: string | null | undefined;

function jeton(): string | null {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (process.env.NODE_ENV !== "development") return null;
  if (jetonCli === undefined) {
    try {
      jetonCli = execFileSync("gh", ["auth", "token"], { encoding: "utf8", timeout: 5000 }).trim() || null;
    } catch {
      jetonCli = null;
    }
  }
  return jetonCli;
}

/** Vrai si GitHub est joignable avec un jeton (sinon : lecture des fichiers embarqués). */
export function depotConfigure(): boolean {
  return jeton() !== null;
}

export class ErreurDepot extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "ErreurDepot";
  }
}

async function github(depot: Depot, chemin: string, init: RequestInit & { accept?: string } = {}) {
  const valeur = jeton();
  if (!valeur) throw new ErreurDepot("GITHUB_TOKEN manquant", 401);

  const { accept = "application/vnd.github+json", headers, ...reste } = init;
  const reponse = await fetch(`https://api.github.com/repos/${DEPOTS[depot]}${chemin}`, {
    ...reste,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
    headers: {
      Accept: accept,
      Authorization: `Bearer ${valeur}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...headers,
    },
  });

  if (!reponse.ok) {
    throw new ErreurDepot(`GitHub ${reponse.status} sur ${DEPOTS[depot]}${chemin} : ${await reponse.text().catch(() => "")}`, reponse.status);
  }
  return reponse;
}

const encoderChemin = (chemin: string) => chemin.split("/").map(encodeURIComponent).join("/");

async function lireBrut(depot: Depot, chemin: string, ref = BRANCHE): Promise<Response | null> {
  try {
    return await github(depot, `/contents/${encoderChemin(chemin)}?ref=${encodeURIComponent(ref)}`, {
      accept: "application/vnd.github.raw+json",
    });
  } catch (erreur) {
    if (erreur instanceof ErreurDepot && erreur.status === 404) return null;
    throw erreur;
  }
}

export async function lireTexte(depot: Depot, chemin: string, ref?: string): Promise<string | null> {
  const reponse = await lireBrut(depot, chemin, ref);
  return reponse ? reponse.text() : null;
}

export async function lireBinaire(depot: Depot, chemin: string): Promise<ArrayBuffer | null> {
  const reponse = await lireBrut(depot, chemin);
  return reponse ? reponse.arrayBuffer() : null;
}

/** Fichier à écrire (texte ou binaire) ; `null` le supprime. */
export type Changement = { chemin: string; contenu: string | Uint8Array | null };

/**
 * Lit, modifie et commite en une seule opération (un seul commit, même pour plusieurs
 * fichiers). Si quelqu'un a publié entre la lecture et l'écriture, la branche a bougé :
 * tout est rejoué sur la nouvelle version, jusqu'à 4 fois.
 *
 * `preparer` reçoit un lecteur figé sur le commit de départ et renvoie les changements,
 * ou null pour ne rien commiter.
 */
export async function commiter(
  depot: Depot,
  message: string,
  preparer: (lire: (chemin: string) => Promise<string | null>) => Promise<Changement[] | null>
): Promise<{ commit: string } | null> {
  for (let essai = 1; ; essai += 1) {
    const ref = await (await github(depot, `/git/ref/heads/${encodeURIComponent(BRANCHE)}`)).json();
    const parent: string = ref.object.sha;

    const changements = await preparer((chemin) => lireTexte(depot, chemin, parent));
    if (!changements || changements.length === 0) return null;

    const commitParent = await (await github(depot, `/git/commits/${parent}`)).json();

    const entrees = await Promise.all(
      changements.map(async ({ chemin, contenu }) => {
        if (contenu === null) return { path: chemin, mode: "100644", type: "blob", sha: null };
        const blob = await (
          await github(depot, "/git/blobs", {
            method: "POST",
            body: JSON.stringify(
              typeof contenu === "string"
                ? { content: contenu, encoding: "utf-8" }
                : { content: Buffer.from(contenu).toString("base64"), encoding: "base64" }
            ),
          })
        ).json();
        return { path: chemin, mode: "100644", type: "blob", sha: blob.sha as string };
      })
    );

    const arbre = await (
      await github(depot, "/git/trees", {
        method: "POST",
        body: JSON.stringify({ base_tree: commitParent.tree.sha, tree: entrees }),
      })
    ).json();

    // Rien n'a changé (republication à l'identique) : pas de commit vide.
    if (arbre.sha === commitParent.tree.sha) return null;

    const commit = await (
      await github(depot, "/git/commits", {
        method: "POST",
        body: JSON.stringify({ message, tree: arbre.sha, parents: [parent] }),
      })
    ).json();

    try {
      await github(depot, `/git/refs/heads/${encodeURIComponent(BRANCHE)}`, {
        method: "PATCH",
        body: JSON.stringify({ sha: commit.sha, force: false }),
      });
      return { commit: commit.sha };
    } catch (erreur) {
      // 422 : la branche a avancé entre-temps (publication concurrente).
      if (erreur instanceof ErreurDepot && erreur.status === 422 && essai < 4) continue;
      throw erreur;
    }
  }
}
