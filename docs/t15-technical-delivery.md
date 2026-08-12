# T15 — Livraison technique Gabriel → Baptiste

> VERSION À RECETTER — NE VAUT NI CONFORMITÉ NI AUTORISATION DE MERGE

## Admission et architecture

- Mission : ticket GitHub #15, demandé par Julien, propriétaire technique Théo.
- Décision produit confirmée : commentaire de Julien du 12 août 2026 autorisant le développement direct sans nouvelle maquette Figma, dans la DA du panier existant.
- Branche : `feature/t15-cart-recommendations`, cible `main`, workspace Superset isolé.
- Architecture : lecture serveur du catalogue disponible via le client Supabase existant ; sélection pure et déterministe côté client depuis le panier local ; aucun nouvel endpoint, schéma, RLS, package ou appel de commande.
- Priorité : `sort_order`, nom puis identifiant, avec les catégories présentes dans le panier placées avant le fallback.
- Variantes : tout produit portant une variation ou plusieurs prix par poids renvoie vers sa fiche. Aucune valeur n'est choisie arbitrairement.

## Faits, hypothèses et manques

- `confirmed` — catalogue, catégories, prix, médias et disponibilité viennent de `products` et de ses relations existantes.
- `confirmed` — le panier est un contexte React persisté dans `localStorage`; `addItem` ne crée pas de commande et ne fait aucune écriture Supabase.
- `confirmed` — l'infrastructure Playwright T12 de la PR #18 est intégrée via le merge `3ecd1bf` de `origin/main`.
- `hypothesis` — `sort_order` est l'ordre éditorial stable approprié au fallback ; validation finale de l'architecture par Théo requise.
- `missing` — aucune preview déployée ; la recette locale Chromium est exécutée, mais le contrôle final multi-navigateurs et appareil réel reste à Baptiste.
- `non vérifiable` — Pixel Perfect contre une nouvelle frame, explicitement différé par la décision produit.

## Périmètre livré

- maximum trois recommandations, exclusion du panier et des indisponibles ;
- lorsque le panier est vide, tirage aléatoire de trois produits disponibles, stable pendant le rendu courant ;
- priorité de catégorie et fallback stable ;
- recalcul à chaque mutation des lignes du panier ;
- image ou fallback, nom, poids/prix existants et action accessible ;
- garde anti-double activation, ajout local immédiat et message visible annoncé ;
- état de chargement à l'hydratation, catalogue indisponible, aucun résultat, moins de trois résultats, image absente, choix requis et ajout en cours/succès/erreur ;
- dialogue clavier avec focus initial, boucle de focus, Échap et restitution du focus ;
- zone centrale défilable, footer total/CTA non rétractable et mouvement réduit.

Hors périmètre respecté : T03, Figma, profilage/historique, migration/RLS, données distantes, commande, déploiement et merge.

## Contrôles exécutés

| Commande | Résultat |
| --- | --- |
| `npm test` | 5/5 tests passent : limite/exclusions, priorité/fallback, aucun ou moins de trois résultats, recalcul, choix obligatoire. |
| `npx tsc --noEmit` | code 0. |
| `npm run build` | code 0, compilation et vérification Next.js réussies. |
| `git diff --check` | code 0. |
| `npm ci` | code 0 ; 405 packages installés depuis le lockfile. |
| `npm run lint` | code 0 ; aucun avertissement ni erreur ESLint. |
| `npm run typecheck` | code 0. |
| `npm run test:e2e:chromium` | code 0 ; 24 tests réussis, 2 ignorés par conception, dont 9 exécutions T15 réussies sur desktop/mobile. |

`npm ci` signale 10 vulnérabilités dans l'arbre verrouillé existant (2 faibles, 8 élevées). Aucun `npm audit fix` n'a été appliqué car cela sortirait du périmètre et pourrait modifier les dépendances.

## Recette E2E exécutée et transmission à Baptiste

Version : merge `3ecd1bf`, tests/correction `f857dd2`, puis commit documentaire de transmission. Preview : `non disponible`.

Le mock Supabase local contient cinq produits déterministes et refuse toute écriture. Son endpoint d'audit `/requests` est contrôlé après l'ajout et retourne `{ "writes": [] }`. Les scénarios vérifient réellement : panier non vide, trois suggestions maximum, exclusion du produit présent, ajout local, total de 5 € à 11 €, compteur à deux, dialogue toujours ouvert, recalcul/exclusion de la suggestion ajoutée, boucle de focus/Échap, footer et CTA visibles à 390×844.

Pour chacun des viewports `390×844`, `768×1024` et `1440×900` :

1. Ouvrir un produit disponible sans choix, l'ajouter puis ouvrir le panier.
2. Vérifier au plus trois suggestions, aucune ligne déjà au panier et aucune indisponible ; comparer les catégories et `sort_order` aux données lues.
3. Ajouter une suggestion par clic puis double-clic rapide : une seule unité est ajoutée, total et compteur changent immédiatement, le panier reste ouvert, le message est visible et annoncé, la suggestion disparaît et la suivante entre de façon stable.
4. Sur un produit avec variation ou prix par poids, vérifier l'action « Choisir », l'ouverture de la fiche et l'absence d'ajout avant sélection.
5. Naviguer intégralement avec Tab/Maj+Tab, vérifier le focus visible, la boucle dans le dialogue, Échap et la restitution du focus.
6. Avec plusieurs lignes, faire défiler les produits et recommandations : le total et le CTA restent visibles, sans collision.
7. Simuler une image absente, un catalogue vide et une erreur de lecture catalogue ; le panier reste utilisable.
8. Activer `prefers-reduced-motion: reduce` et vérifier l'absence d'animation significative.
9. Observer console, `pageerror`, requêtes échouées et réseau : l'ajout ne doit appeler aucune route de commande ni effectuer d'écriture Supabase. Cette absence d'écriture est automatisée par l'endpoint d'audit du mock.

Risques/limites : l'erreur d'ajout est défensive, car l'ajout local synchrone actuel n'expose pas de résultat d'erreur ; le prix affiché d'un produit à poids est le minimum existant et l'utilisateur choisit le poids sur la fiche. La suite générale émet encore deux avertissements préexistants hors T15 pendant certaines navigations : clé React manquante dans la liste produits et image `/images/recettes-hero.jpg` invalide/absente ; ils n'ont causé aucun échec final et ne sont pas corrigés dans ce ticket.

Validations attendues : Théo pour l'architecture et la PR ; Julien uniquement si un écart visible à la DA existante est identifié. Merge et déploiement humains uniquement.
