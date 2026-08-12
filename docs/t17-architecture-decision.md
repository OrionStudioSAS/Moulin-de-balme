# T17 — Décision d'architecture à revoir par Théo

## Statut

Proposée dans la PR T17 ; validation technique et réglementaire de Théo requise
avant fusion ou publication.

## Décision

La V1 utilise `FLOUR_CLASSIFICATION_CONTENT_V1`, un contrat TypeScript statique,
explicite et versionné. Chaque carte contient sa copie approuvée et un mapping
`productsBySlug` dont les clés sont les slugs catalogue vérifiés par Pauline et
les valeurs les noms de produit exacts.

Le composant ne reçoit pas les produits Supabase et ne lit aucun nom produit pour
déduire une espèce ou un type. L'unique activation demeure la condition existante
`categorie === "farines"` dans la page publique produits. Les liens sont donc
déterministes et indépendants des libellés courants du payload.

## Pourquoi ce choix

- Le schéma actuel ne contient aucun champ structuré d'espèce, de type ou d'usage.
- Parser les noms à l'exécution est explicitement interdit et rendrait les
  associations sensibles aux renommages.
- Modifier Supabase, le schéma ou les données est hors périmètre T17.
- Un contrat versionné rend toute évolution de copie, source, type ou slug visible
  en revue de code et testable sans mutation distante.

## Maintenance et garde-fous

Le propriétaire d'une prochaine version doit vérifier les slugs contre le
catalogue, mettre à jour la version du contrat, conserver une source traçable et
obtenir les validations Julien/Théo. Un renommage de libellé ne doit jamais être
propagé automatiquement. Les types seigle, épeautre et tout autre type restent
absents jusqu'à un nouveau contrat explicitement validé.

Les tests Playwright T17 verrouillent les quatre types, les onze noms/liens, la
copie exacte, les exclusions éditoriales, l'isolation Farines et le reflow
`4 / 2 / 1` aux viewports demandés.

## Validation attendue de Théo

- accepter ou remplacer ce contrat statique avant fusion ;
- confirmer les plages, les sources, l'espèce blé et les onze mappings ;
- confirmer l'isolation de rendu, l'accessibilité et la couverture de test ;
- interdire la fusion/publication tant que les validations Julien et Baptiste ne
  sont pas consignées.
