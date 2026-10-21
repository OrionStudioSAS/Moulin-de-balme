# T14 — Recette de la preview publique

## Verdict

**Non vérifiable** au 12 août 2026.

La preview répond en HTTP et les routes principales ainsi que six fiches dynamiques échantillonnées ont été contrôlées. Deux défauts de navigation ont été confirmés par le HTML réellement servi et des requêtes HTTP. En revanche, aucun navigateur pilotable n'était disponible dans la session : les parcours interactifs, les captures, la console, le réseau navigateur, les trois viewports, le clavier et la réduction du mouvement n'ont pas pu être exécutés. L'identifiant immuable du déploiement Vercel testé n'a pas non plus été fourni. Ces limites empêchent de satisfaire les critères d'acceptation de l'issue #14.

Ce verdict est une recommandation QA. Il ne vaut ni conformité Pixel Perfect, ni approbation, merge ou déploiement.

## Référence testée

- URL : `https://moulin-de-balme.vercel.app/`
- Date : 2026-08-12, fuseau Europe/Paris
- Branche locale : `qa/t14-preview-audit`
- Commit local observé : `47bcde64846343f065195fc2b3b93376b4b2c81b`
- Version Vercel immuable : **manquante** ; le commit local ne peut pas être assimilé au déploiement sans preuve.
- Réponse d'accueil : HTTP 200, serveur Vercel, `x-matched-path: /`, ressources Next.js identifiées par hashes.

## Résultats

- Défauts confirmés : T14-DEF-001 et T14-DEF-002.
- Anomalies issues du code mais non reproduites : T14-OBS-001 à T14-OBS-003.
- Routes HTTP : 13 réponses 200 sur 13 routes attendues/échantillonnées ; `/collections`, cible d'un CTA public, répond 404.
- Formulaire de commande : non soumis conformément aux interdictions.
- Ajout panier : non exécuté faute de navigateur ; aucune donnée externe n'a été envoyée.
- Pixel Perfect : non vérifiable, frames/nodes Figma, états, polices et tolérances validés absents.

## Contrôles impossibles

- navigation par clic et comportement des CTA ;
- recherche ;
- ouverture/fermeture du panier et ajout local au panier ;
- filtres de recettes ;
- erreurs JavaScript, `pageerror` et console ;
- requêtes navigateur échouées et chargement effectif des images ;
- captures mobile 390×844, tablette 768×1024 et desktop 1440×900 ;
- responsive, débordements et lisibilité rendue ;
- navigation clavier, ordre de tabulation et focus visible ;
- dialogues, overlays, piège/restauration du focus et fermeture Escape ;
- réduction du mouvement ;
- vérification runtime des noms accessibles et labels de formulaire.

## Transmission

Défauts verts transmissibles à Gabriel :

- T14-DEF-001 — route `/collections` absente derrière un CTA public ;
- T14-DEF-002 — ancre `/#stephane-reinat` sans cible dans la page d'accueil.

Décisions requises :

- **Julien** : confirmer la destination produit/contenu attendue des deux CTA ; fournir les frames Figma exactes validées et les tolérances si une recette Pixel Perfect est attendue.
- **Théo** : identifier et confirmer la version/commit immuable du déploiement Vercel ; fournir une session avec navigateur/Playwright disponible pour reprendre la recette complète ; statuer sur le no-go technique lié aux critères non exécutés.

