# Accessibilité — T14

## Contrôles exécutés

- Langue du document servie : `lang="fr"` observé dans le HTML de l'accueil.
- Titre de l'accueil présent : `Le Moulin de Balme® — Boulangerie Artisanale`.
- Images principales observées dans le HTML avec attributs `alt` ; le chargement visuel effectif n'a pas été vérifié.
- Analyse statique ciblée des champs, overlays et commandes publiques.

## Contrôles non exécutés

- parcours complet Tab/Maj+Tab et ordre de focus ;
- visibilité du focus aux trois viewports ;
- activation Entrée/Espace ;
- noms accessibles calculés ;
- restitution lecteur d'écran ;
- contrastes mesurés sur le rendu ;
- zoom/reflow ;
- dialogues, focus trap et restauration du focus ;
- réduction du mouvement avec `prefers-reduced-motion` ;
- audit automatisé axe/Lighthouse.

## Anomalies candidates à retester

- Le formulaire conditionnel de click-and-collect utilise des placeholders sans labels programmatiques visibles dans le code.
- Les overlays recherche et panier ne déclarent pas de sémantique de dialogue et ne montrent pas une gestion complète du focus.
- Plusieurs boutons `+`, `−` et `Supprimer` nécessitent une vérification de leur nom accessible en contexte.

Ces éléments sont documentés comme observations de code, pas comme défauts runtime confirmés. Voir `defects.md`.

