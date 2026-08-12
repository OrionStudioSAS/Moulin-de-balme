# Journal de preuves — T14

| Horodatage | Acteur | Niveau | Source/action | Résultat | Validation |
| --- | --- | --- | --- | --- | --- |
| 2026-08-12 | Baptiste/Codex | vert | `git branch --show-current` et `git status --short --branch` | branche `qa/t14-preview-audit`, état initial propre | aucune |
| 2026-08-12 | Baptiste/Codex | vert | lecture intégrale Orion Agent OS : constitution, `governance/`, mandat/prompt Baptiste, mission QA, Playwright, contrats, matrice | règles de recette et limites appliquées | aucune |
| 2026-08-12 | Baptiste/Codex | vert | sélection du navigateur pour l'URL puis diagnostic et inventaire | aucun navigateur disponible (`[]`) | Théo doit fournir l'environnement de reprise |
| 2026-08-12 | Baptiste/Codex | vert | lecture GitHub issue #14 | issue ouverte, critères et gouvernance confirmés | aucune |
| 2026-08-12 | Baptiste/Codex | vert | `curl -sS -L` sur accueil | HTTP 200 ; Vercel/Next.js ; HTML public obtenu | aucune |
| 2026-08-12 | Baptiste/Codex | vert | matrice HTTP des routes et fiches | 13 routes attendues/échantillonnées en 200 | aucune |
| 2026-08-12 | Baptiste/Codex | vert | requête de `/collections` depuis le CTA public | HTTP 404 ; T14-DEF-001 | Julien confirme la destination |
| 2026-08-12 | Baptiste/Codex | vert | inspection du HTML accueil pour `#stephane-reinat` | cible absente ; T14-DEF-002 | Julien confirme la destination |
| 2026-08-12 | Baptiste/Codex | vert | lecture ciblée des composants publics | trois anomalies candidates, non reproduites | Julien/Théo selon `defects.md` |

## Limites de preuve

- Aucun cookie, jeton, secret ou contenu de réponse Supabase sensible n'est conservé dans le dépôt.
- Les fichiers HTML temporaires ont été placés sous `/tmp` et ne sont pas versionnés.
- Aucune capture n'a été créée puisque aucun navigateur n'était disponible.
- Aucun test planifié ou impossible n'est présenté comme exécuté.

