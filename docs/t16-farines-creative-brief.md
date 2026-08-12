# T16-LEONIE — Brief créatif et UX de la catégorie Farines

> DOCUMENT DE TRANSMISSION — NE VAUT NI COMMANDE NI LANCEMENT
>
> Statut : **EXPLORATOIRE — NON FINALISABLE**
>
> Condition : **CONDITIONNEL — VALIDATION PAULINE REQUISE**. La qualification Pauline et sa preuve de validation ne figurent ni dans l’issue ni dans les sources remises. La direction ci-dessous est assez précise pour préparer l’implémentation, mais elle ne devient transmissible à Gabriel qu’après validation explicite de Julien et, pour les choix techniques sensibles, de Théo.

## 1. Résumé non décisionnel

Le rapprochement le plus cohérent avec l’issue est une **transposition du rythme Figma dans les tokens et les données réelles du Moulin de Balme** : hero éditorial de 465 px, filtre en bande horizontale, grille de quatre colonnes sur grand écran, cartes brun/crème à image carrée dominante et CTA pleine largeur. Cette piste reprend la composition des nœuds Figma utiles sans importer leur catalogue de démonstration.

La page réelle impose quatre écarts structurants : les 19 produits Farines observés n’ont actuellement ni image ni badge, 15 affichent `0,00 €`, aucune sous-catégorie Farines n’est rendue, et le callout « Recette du moment » n’a pas de média réel dans l’implémentation. Ces états doivent rester alimentés par Supabase et ne doivent jamais être maquillés avec les noms, prix, badges ou visuels du Figma.

Le brief porte exclusivement sur `/produits?categorie=farines`. Il ne demande aucune modification de Figma, de Supabase, des dépendances, du back-office, des autres catégories, du header, du footer ou du panier partagé.

## 2. Gouvernance et périmètre

### Mission

- Identifiant : `T16-LEONIE`.
- Demandeur et propriétaire humain : Julien, selon la demande de mission ; preuve formelle d’autorité non jointe au ticket.
- Pilotage : Pauline selon le mandat Léonie ; qualification/validation Pauline non fournie.
- Validation créative : Julien.
- Validation technique, architecture, données et non-régression : Théo.
- Préparé par : Léonie.
- Autonomie : préparation et documentation uniquement ; aucune modification d’application, de Figma ou de données.

### Inclus

- Variante visuelle activée uniquement lorsque `categorie === "farines"`.
- Hero Farines, navigation/filtrage existant, grille, cartes produit, états réels, responsive, interactions, accessibilité et critères visuels.
- Réemploi des requêtes, contenus, liens de fiche, ajout au panier, composants et tokens existants.
- États avec et sans image, badge, sous-catégorie, prix pondéré et résultat produit.

### Exclus

- Page générale `/produits` et catégories Pain, Viennoiseries, Pâtisseries, Confitures, Sel et Miel.
- Sections Figma « Guide de classification », « Moulin de Colagne », Instagram, newsletter, témoignages et footer.
- Création ou correction de données Supabase, prix, images, droits, badges, textes, sous-catégories ou recettes.
- Modification de Figma, du schéma/RLS Supabase, des commandes, du back-office, des dépendances, du déploiement ou du merge.
- Refonte du header, du footer, du tiroir panier ou des fiches produit.

## 3. Provenance et méthode

Les seules sources autorisées et effectivement consultées sont listées en `S-01` à `S-13`. Les observations du site en production proviennent du HTML rendu le 12 août 2026 ; aucune capture visuelle du live n’a pu être produite, car aucun navigateur contrôlable n’était disponible. Les comparaisons visuelles live/Figma restent donc à réaliser par Baptiste sur la preview de Gabriel.

Le contexte Figma a été extrait avec le contexte de design du nœud exact avant toute spécification. Le code généré par Figma n’est traité que comme référence de géométrie, typographie et couleurs ; il ne doit pas être copié tel quel.

## Faits sourcés

| ID | Fait vérifié | Preuve exacte | Conséquence |
| --- | --- | --- | --- |
| F-01 | L’issue limite la variante à `categorie=farines`, conserve les données et comportements métier, interdit les données fictives et exige quatre colonnes au grand écran. | `S-01`, sections « Périmètre fonctionnel », « Direction visuelle attendue », « Règles et garde-fous ». | Toute bifurcation doit être locale à Farines ; la source de vérité demeure Supabase. |
| F-02 | La page charge en parallèle catégories, sous-catégories, produits disponibles et réglage de bannière, puis filtre côté serveur selon `categorie` et `sous`. | `S-04`, lignes 15–52. | Ne pas remplacer le chargement réel ni figer une liste de produits/filtres. |
| F-03 | Le hero actuel prend son titre, sous-titre, texte et image depuis la catégorie avec fallback au réglage global. | `S-04`, lignes 54–65. | Conserver les champs réels ; aucune copie Figma codée en dur. |
| F-04 | Le hero actuel mesure déjà 465 px, utilise l’image en `object-cover`, un voile noir à 40 % et une composition basse gauche. | `S-04`, lignes 68–97. | La hauteur et le voile Figma sont déjà présents ; le principal écart est la hiérarchie typographique et la largeur du texte. |
| F-05 | Le filtre principal liste toutes les catégories et le second filtre n’apparaît que si la catégorie possède des sous-catégories. | `S-04`, lignes 99–161. | Farines ne doit pas recevoir de faux filtres ; un second niveau vide est omis. |
| F-06 | La grille actuelle est 2 colonnes par défaut, 3 dès `md`, 4 dès `lg`, avec 20 px horizontal et 40 px vertical ; un callout de deux colonnes est inséré après le sixième produit. | `S-04`, lignes 163–193. | La variante peut resserrer le rythme et modifier les breakpoints uniquement pour Farines ; l’ordre des produits et le callout existant restent stables. |
| F-07 | `ProductCard` conserve un lien vers la fiche, utilise une image carrée ou un fallback décoratif, rend le badge seulement s’il existe, applique la logique réelle de prix et appelle `addItem(product)`. | `S-05`, lignes 18–56. | La variante doit conserver ces contrats et peut être portée par une prop opt-in sans changer la variante par défaut. |
| F-08 | Le panier ajoute/incrémente l’article, persiste dans `localStorage` et ouvre le tiroir sans rechargement. | `S-09`, lignes 40–71 et 87–94. | Le nouveau CTA ne doit pas devenir un lien ou contourner `addItem`. |
| F-09 | Les tokens du projet sont Helvetica Neue, crème `#F5F0E8`, crème foncé `#EDE8DE`, brun `#3D2B1F`, brun clair `#6B4A35`, or `#C9A96E`, gris chaud `#8C7B6B`. | `S-07`, lignes 13–29 ; `S-08`, lignes 5–18. | Réutiliser ces tokens en piste recommandée ; ne pas installer de police. |
| F-10 | Le frame Figma fait `1440 × 5008`. Son hero fait `1441 × 465`, commence à `y=44`, et son bloc éditorial fait 940 px de large. | `S-02`, nœuds `192:3835`, `229:4380`, `229:4383`, `229:4384`. | La composition du premier écran peut être mesurée sans reproduire les positions absolues du frame entier. |
| F-11 | Le Figma montre une bande filtre de 76 px puis une grille de 1 372 px : 4 cartes de 327 px séparées d’environ 21,33 px. Chaque carte fait 444 px, avec 20 px de padding horizontal et une image intérieure carrée de 287 px. | `S-02`, nœuds `236:6621`, `229:4414`, `229:4415`, `229:4416`, `229:4418`. | Ces valeurs servent de cible desktop, avec écarts documentés pour le tactile et le contenu réel. |
| F-12 | Le Figma utilise le brun carte `#4B3A33`, le fond `#FFF7EF`, le texte de filtre `#3A312E`, un voile noir à 40 %, Helvetica Regular/Bold et des titres en capitales. | `S-02`, contexte de design des nœuds `229:4380`, `236:6621`, `229:4414`. | Ce sont des références Figma, pas des tokens validés pour le code. |
| F-13 | Le Figma contient des noms, prix, badges, images de sacs et filtres de pains de démonstration qui ne correspondent pas à la gamme live. | `S-02`, nœuds `229:4416`–`229:4670` et `236:6624`–`236:6636`. | Aucun de ces contenus ne doit être copié, même comme placeholder. |
| F-14 | Le HTML live observé le 12 août 2026 rend 19 cartes Farines, aucune image produit, aucun badge, aucune barre de sous-catégories ; 15 cartes affichent `0,00€` et quatre affichent un prix positif (`4,50€`, `5,00€`, `6,80€`, `7,20€`). | `S-03`, HTML SSR de la grille et payload produit. | Les critères visuels doivent couvrir les fallbacks et ne pas considérer une image Figma comme attendue. Le prix reste une donnée, pas une décision UX T16. |
| F-15 | Le live rend le vrai hero « Nos farines » avec l’image de bannière Supabase et le texte de catégorie ; la chaîne contient actuellement `del’eau`. | `S-03`, HTML SSR du hero. | Ne pas corriger silencieusement la copie dans le code ; décision de contenu attendue de Julien/détenteur des données. |
| F-16 | Les tests Playwright existants couvrent des parcours publics génériques à 1440×900 et 390×844, mais aucun test Farines dédié ; 768×1024 est demandé par l’issue mais absent de la configuration. | `S-11`, lignes 32–128 ; `S-12`, projets `desktop-chromium` et `mobile-chromium`. | Gabriel doit ajouter une couverture ciblée ; Baptiste doit contrôler le viewport tablette explicitement. |
| F-17 | Les captures live n’étaient pas disponibles dans cette mission ; seul le HTML public et le code réel ont été inspectés. | Journal d’exécution T16-LEONIE, 12 août 2026. | Aucun jugement « pixel perfect live » n’est formulé ici ; les captures desktop/mobile sont déléguées à Baptiste. |

## Hypothèses

| ID | Hypothèse de travail | Impact si fausse | Vérification/autorité |
| --- | --- | --- | --- |
| H-01 | Le breakpoint `lg` actuel (1 024 px) reste la frontière de la grille 4 colonnes. | Une largeur intermédiaire pourrait produire des cartes trop étroites. | Gabriel vérifie à 1 024, 1 280 et 1 440 px ; Théo arbitre le breakpoint si nécessaire. |
| H-02 | La direction « éditoriale » de l’issue vise le premier écran et les cartes, pas l’ajout des longues sections éditoriales présentes plus bas dans le Figma. | L’absence d’un guide ou d’un récit moulin pourrait être perçue comme un écart de périmètre. | Julien confirme que les nœuds `197:15` et `235:5255` sont hors T16. |
| H-03 | Une grille 2 colonnes à 768 px et à 390 px offre le meilleur compromis entre densité des 19 produits et lisibilité. | Julien peut préférer 3 colonnes tablette ou 1 colonne mobile. | Validation visuelle de Julien sur les trois viewports de référence. |
| H-04 | Les couleurs de production doivent primer sur les hex Figma proches, conformément à la demande de conserver la DA existante. | La page paraîtra légèrement plus sombre et moins rosée que le frame. | Julien choisit entre pistes A et B ci-dessous. |
| H-05 | Le callout existant reste structurellement présent, sans ajout de média ou copie, car sa suppression n’est pas demandée. | Un callout sans image restera moins fidèle au Figma. | Julien confirme maintien ou retrait ; toute connexion à une vraie recette requiert cadrage produit/technique. |
| H-06 | Les fallbacks de cartes peuvent rester abstraits et décoratifs tant que Supabase ne fournit pas d’image. | Le rendu sera moins marchand que la maquette. | Julien valide l’état sans image ; le propriétaire des données fournit ultérieurement médias, alt et droits si souhaité. |

## Informations manquantes

| ID | Information manquante | Impact | Bloquant | Autorité / preuve attendue |
| --- | --- | --- | --- | --- |
| M-01 | Qualification Pauline, statut et preuve de validation. | Interdit de présenter le brief comme final ou de lancer Gabriel. | Oui, pour finalisation/transmission. | Pauline ou lien GitHub explicite de validation. |
| M-02 | Validation explicite de Julien pour la piste A ou B et pour les adaptations responsive. | Empêche de déclarer la direction créative approuvée. | Oui, pour réalisation finale. | Commentaire GitHub de Julien citant T16 et la piste choisie. |
| M-03 | Captures visuelles du live aux trois viewports. | Empêche de quantifier les écarts visuels réels avant implémentation. | Non pour préparer ; oui pour recette pixel perfect. | Baptiste : captures 1440×900, 768×1024, 390×844. |
| M-04 | Prix finalisés pour les 15 produits à `0,00€`. | Risque d’interprétation « gratuit » et de panier à zéro ; hors compétence créative. | Non pour le style, sensible pour mise en production. | Propriétaire des données + Théo ; aucune correction T16. |
| M-05 | Images produit, textes alternatifs dédiés, crédits et droits. | Les cartes resteront en fallback ; impossible d’atteindre la richesse visuelle Figma. | Non, si fallback accepté. | Julien/propriétaire des médias, preuve de droits et champs Supabase. |
| M-06 | Sous-catégories Farines ou règle métier de filtre additionnel. | Le bouton Figma « Filtres » n’a aujourd’hui aucun contenu réel à piloter. | Non : le filtre de catégories existant suffit. | Pauline/Théo si de nouveaux filtres sont demandés. |
| M-07 | Validation/correction de la copie hero, notamment `del’eau`. | Une correction codée en dur désynchroniserait le CMS. | Non pour mise en page. | Julien + correction dans la donnée par un acteur autorisé. |
| M-08 | Source réelle, image, destination et statut du callout « Recette du moment ». | Interdit de reprendre la tartine Figma ou d’inventer une recette. | Non si le callout actuel est conservé sans enrichissement. | Julien/Pauline, puis Théo pour la source de données. |
| M-09 | Navigateurs/appareils au-delà des viewports Chromium déjà configurés. | La compatibilité Safari/Firefox ne peut pas être affirmée. | Non pour le brief. | Théo définit la matrice ; Baptiste l’exécute. |

## Challenge créatif

1. **Positionnement.** La page doit-elle vendre d’abord une gamme de farines ou raconter le moulin ? Le ticket privilégie l’achat facile et le hero éditorial, mais ne valide pas les longues sections didactiques du frame. Ajouter ces sections maintenant déplacerait le projet d’un rapprochement visuel vers une création de contenu.
2. **Cible.** Les 19 références, dont plusieurs types proches, supposent un visiteur capable de distinguer T55/T65/T80/T150. Sans sous-catégories ni contenu validé, la meilleure aide immédiate est une grille lisible et des noms réels, pas des filtres factices.
3. **Confiance.** Quinze prix à zéro et l’absence d’images dégradent la perception marchande. Le design ne doit pas masquer cette dette de données. La question de publication de ces produits appartient au propriétaire des données et à Théo.
4. **Expérience.** Le Figma utilise des CTA de 35 px ; un usage tactile confortable demande au moins 44 px. L’écart de 9 px est volontaire et doit être accepté comme adaptation, pas comme défaut de fidélité.
5. **Conversion.** Le callout de recette concurrence deux emplacements produit et pointe actuellement vers `/produits`. Tant qu’une destination réelle n’est pas validée, il ne doit ni gagner une image Figma ni être présenté comme une conversion éditoriale aboutie.

## Directions exploratoires comparées

### Piste A — « Transposition Moulin » — recommandation conditionnelle

- Reprendre la géométrie et la hiérarchie des nœuds Figma : hero 465 px, bloc texte large, filtre de 76 px, grille 4 colonnes, cartes encadrées et denses.
- Utiliser les tokens existants `cream`, `brown`, `gold`, `warm-gray` et la pile Helvetica Neue.
- Afficher strictement les données Supabase et le fallback actuel quand un média manque.
- Conserver les contrats `ProductCard`, lien de fiche et `addItem`, idéalement via une variante opt-in `farines` dont la valeur par défaut ne change rien ailleurs.

Forces : cohérence de marque et de maintenance ; répond explicitement à F-01, F-07 et F-09 ; contraste brun/crème calculé à environ 11,84:1.

Risques : teintes légèrement plus sombres que le Figma ; état sans images très présent ; nécessite l’accord de Julien sur l’écart chromatique.

### Piste B — « Fidélité chromatique locale »

- Reprendre la même composition, mais appliquer uniquement dans la branche Farines `#FFF7EF`, `#4B3A33`, `#3A312E` et `#FEF2E4` tels que lus dans le Figma.
- Garder les mêmes données, fallbacks, interactions et contraintes de non-régression que la piste A.

Forces : proximité visuelle supérieure avec le frame ; contraste carte Figma brun/crème calculé à environ 10,14:1.

Risques : mini-système chromatique parallèle, divergence des tokens existants, coût de maintenance et possible rupture de la DA globale. Choix réservé à Julien ; Théo valide son encapsulation.

### Comparaison

| Dimension | Piste A | Piste B |
| --- | --- | --- |
| Composition Figma | Forte | Forte |
| Fidélité chromatique | Adaptée à la marque live | Plus littérale |
| Réemploi des tokens | Total | Partiel/local |
| Risque autres catégories | Faible avec variante opt-in | Faible seulement si styles strictement encapsulés |
| Recommandation Léonie | Oui, conditionnelle | Alternative à faire arbitrer |

## Arborescence et parcours

### Arborescence

- `/produits?categorie=farines` : seule page visuellement adaptée.
- `/produits?categorie=farines&sous={slug}` : même variante, seulement si un slug réel existe.
- `/produits/{product.slug}` : destination existante, inchangée.
- Tiroir panier : composant partagé inchangé.
- `/produits` et autres `categorie` : rendu actuel inchangé.

Statut : arborescence de code vérifiée ; validation créative spécifique non fournie.

### Parcours principal

1. Le visiteur arrive sur la catégorie Farines et identifie immédiatement le titre, le contexte et l’image réelle du hero.
2. Il peut changer de catégorie dans la bande horizontale ; `Farines` est clairement actif.
3. Si de vraies sous-catégories existent, il les parcourt dans un second niveau ; sinon aucun faux filtre n’apparaît.
4. Il parcourt les produits réels dans leur ordre Supabase.
5. Il active la zone liée de la carte pour ouvrir `/produits/{slug}` ou le bouton distinct pour ajouter au panier.
6. L’ajout ouvre le tiroir et met à jour le compteur sans rechargement.

Cas d’échec/états : liste vide = message actuel ; image absente = fallback actuel ; badge absent = aucun emplacement vide ; prix à zéro = valeur réelle inchangée ; catégorie/sous-catégorie inconnue = comportement actuel, sans invention T16.

## Pages et wireframes textuels

### Écran unique — Farines

```text
[barre d’annonce existante — inchangée]
[header existant superposé — inchangé]
[HERO FARINES, image Supabase + voile]
  [H1 réel]
  [sous-titre réel]
  [description réelle]
[NAV CATÉGORIES horizontale, Farines active]
[NAV SOUS-CATÉGORIES seulement si données réelles]
[GRILLE PRODUITS]
  [carte] [carte] [carte] [carte]       desktop
  [carte] [carte] [callout existant 2 colonnes]
  [suite des cartes selon le flux Supabase]
[footer existant — inchangé]
```

Le callout ne reçoit ni image, ni titre, ni destination empruntés au Figma. Son maintien est H-05 ; son enrichissement dépend de M-08.

## 4. Spécification de composition

### Desktop — 1 024 px et plus ; cible de recette 1 440×900

- Hero : hauteur `465px`; image `object-cover`; voile noir `40%`; contenu aligné bas gauche dans un conteneur de `1372px` max.
- Gouttières à 1 440 px : `34px` visés, tolérance `±4px`.
- Bloc éditorial : largeur max `940px`; bas du hero `56px ±8px`.
- Bande filtre : hauteur `76px ±2px`, immédiatement après le hero ; padding horizontal `30–34px`; bord inférieur 1 px.
- Grille : largeur utile `1372px ±4px`, 4 colonnes égales ; gap horizontal `21px ±3px`, gap vertical `20px ±3px`.
- Carte : largeur cible `327px ±4px`; aucun rayon sur l’enveloppe, l’image ou le CTA ; image carrée.
- Le callout, s’il est maintenu, occupe exactement deux colonnes et reste après le sixième produit, comme l’ordre actuel.

### Tablette — 768 à 1 023 px ; cible 768×1024

- Hero : `420px ±12px`, contenu bas gauche, gouttières `24px`, largeur de texte 100 % plafonnée à `680px`.
- Les trois niveaux de texte s’enroulent naturellement ; aucune hauteur fixe sur le bloc texte.
- Bande catégories : hauteur min `64px`; défilement horizontal tactile ; l’item actif reste visible à l’arrivée.
- Grille : 2 colonnes, gouttières `24px`, gap `20px`; le callout occupe 2 colonnes.
- Carte : padding `16px`; image carrée ; bouton min `44px`.

### Mobile — jusqu’à 767 px ; cible 390×844

- Hero : `380–400px`, gouttières `16px`, contenu ancré à `32px` du bas ; le crop privilégie le centre de l’image réelle, sans position absolue par appareil.
- H1 `40–44px`; sous-titre et description peuvent se replier, sans ellipsis ni clipping.
- Bande catégories : hauteur min `56px`; items de `44px` de haut minimum ; défilement horizontal contenu dans la bande, jamais sur le `body`.
- Grille à 390 px : 2 colonnes, gouttières `16px`, gap `12px`, soit environ `173px` par carte. Sous `360px`, basculer à 1 colonne.
- Carte mobile : padding `12px`; image intérieure carrée ; titre limité visuellement à deux lignes sans couper le nom accessible ; CTA min `44px`.
- Le callout occupe les 2 colonnes à 390 px ou l’unique colonne sous 360 px.

## 5. Hero Farines

- Contenu : utiliser `bannerTitle`, `bannerSubtitle`, `bannerDescription`, `bannerImage` issus du flux actuel (F-03). Aucun texte du Figma n’est une source de secours supplémentaire.
- H1 desktop : Helvetica Neue Regular `80px ±2px`, interligne `81px`, tracking `1.275px`, capitales CSS ; mobile selon la section responsive.
- Sous-titre desktop : Regular `22px ±1px`, interligne `24px`, tracking `0.36px`, capitales CSS.
- Description desktop : Regular `20px ±1px`, interligne `24px`, largeur max `940px`. Sur mobile, `14px/20px` pour contenir la copie réelle.
- Couleur : blanc ; voile noir initial 40 %. Si le contraste mesuré sur le crop réel est inférieur à 4,5:1, renforcer localement le gradient/voile jusqu’au seuil sans dépasser 60 % avant arbitrage Julien.
- Image : conserver l’URL Supabase. Si elle est informative et qu’un alt éditorial est fourni, l’utiliser ; sinon la traiter comme décorative avec `alt=""` puisque le H1 adjacent porte le sujet. Ne pas utiliser `bannerTitle` comme alt de substitution non descriptif sans validation.
- Navigation superposée : conserver le header actuel et vérifier la lisibilité des liens blancs sur l’image ; aucune refonte partagée T16.

## 6. Filtres et navigation de gamme

- Conserver la liste réelle des catégories et leurs URLs. L’ordre vient de `sort_order`.
- Appliquer la composition Figma (bande claire, liste horizontale, actif souligné) à la variante Farines uniquement.
- Actif : texte brun à 100 %, graisse 600/700, soulignement/bordure 1–2 px, `aria-current="page"`.
- Inactif : brun à au moins 65 % d’opacité ; hover à 100 %. Ne pas utiliser une opacité qui descend sous 4,5:1.
- Typographie : `11–13px`, capitales, tracking `0.15em` maximum ; taille lisible prioritaire sur le `10px` du bouton Figma.
- Chaque lien a une zone interactive min `44×44px`.
- Desktop : la liste peut occuper l’espace disponible ; tablette/mobile : `overflow-x:auto`, pas de retour à la ligne, défilement tactile et clavier des liens.
- Sous-catégories : rendre la barre actuelle uniquement si `currentSubs.length > 0`. Ne pas créer « Tous les pains », « Miche… » ou un bouton « Filtres » sans fonction réelle.
- Un bouton « Filtres » n’est autorisé que si une fonctionnalité et un panneau accessibles sont cadrés ultérieurement. Dans T16, il est absent.

## 7. Grille et cartes produit

### Enveloppe de carte

- Fond piste A : `brown` `#3D2B1F`; texte `cream` `#F5F0E8`.
- Fond piste B : `#4B3A33`; texte `#FFF7EF`.
- Padding desktop : `20px` horizontal, `21px` vertical ; tablette `16px`; mobile `12px`.
- Aucun rayon ni ombre. La hiérarchie vient du contraste, de l’image et des espacements.
- Hauteur pilotée par le contenu réel. À 1 440 px, viser `444–456px`; l’écart haut correspond au CTA tactile de 44 px au lieu des 35 px Figma.

### Média et fallback

- Ratio `1:1`, `object-cover`; desktop intérieur visé `287×287px`.
- Si `image_url` est présent : rendre l’image réelle et `alt={product.name}` tant qu’aucun alt éditorial dédié n’existe.
- Si `image_url` est nul/vide : conserver le fallback abstrait existant, sans logo, sac, texte ou pictogramme inventé ; le fallback est décoratif.
- Hover pointeur : zoom image max `1.03–1.05` sur `300–500ms`; aucun zoom au clavier ; désactiver la transition sous `prefers-reduced-motion: reduce`.

### Badge

- Rendu seulement si `product.badge` existe ; aucune réservation de hauteur quand il est absent.
- Conserver les valeurs réelles `nouveau`, `bestseller`, `exclusif` et leurs libellés existants.
- Position de référence : `15px` depuis le haut/gauche de l’image ; hauteur min `22px`, padding horizontal `10px`, texte `10px` gras.
- Ne pas reproduire les badges visibles dans le Figma sur les produits live.

### Nom, prix et CTA

- Nom : Helvetica Regular/Medium, `13–14px`, `15–18px` d’interligne, capitales, tracking `0.02em`; réserver deux lignes sur desktop pour aligner les prix.
- Prix : reprendre exactement la logique `weight_prices` puis `price` de F-07 ; `10.5–12px`, gras, tracking `0.15em`, capitales uniquement pour le préfixe existant. Ne pas masquer ni renommer `0,00€` dans T16.
- Espacements de référence : image → nom `15px`; nom → prix `9px`; prix → CTA `9px`.
- Zone liée : image, nom et prix ouvrent la fiche réelle. Le CTA reste un bouton distinct.
- CTA visible : « Ajouter au panier », hauteur min `44px`, largeur 100 %, bordure crème 1 px, fond brun, texte crème `11px` gras, tracking `0.15em`.
- Hover : fond crème, texte brun. Focus : outline or `#C9A96E` de 2 px, offset 2 px. Libellé accessible recommandé : `Ajouter ${product.name} au panier`.

### Callout existant

- Maintenir sa position après le sixième produit et sa portée de deux colonnes tant que H-05 n’est pas arbitrée.
- Ne pas importer l’image tartine, le titre ou le CTA du Figma.
- Ne pas annoncer une vraie « recette du moment » sans source, destination et média validés (M-08).
- Si Julien demande son retrait, cela constitue une décision de contenu distincte à tracer.

## 8. Typographie, couleurs et espacements

### Typographie

- Famille unique : pile existante `"Helvetica Neue", Helvetica, Arial, sans-serif`.
- Aucun téléchargement de police ; ne pas introduire Inter pour le badge.
- Capitales par CSS afin de conserver les chaînes Supabase intactes.
- Tracking : hero titre `~0.016em`, sous-titre `~0.016em`, labels/CTA `0.15em`; éviter le `0.2–0.3em` sur les longues chaînes mobiles.

### Couleurs

| Usage | Piste A recommandée | Référence Figma | Règle |
| --- | --- | --- | --- |
| Fond page | `cream #F5F0E8` | `#FFF7EF` | Ne pas changer le token global. |
| Carte/CTA | `brown #3D2B1F` | `#4B3A33` | Variante Farines seulement. |
| Texte carte | `cream #F5F0E8` | `#FFF7EF` | Contraste A ≈ 11,84:1. |
| Texte filtre | `brown #3D2B1F` | `#3A312E` | Opacité conforme au contraste. |
| Focus | `gold #C9A96E` | non spécifié | Contraste or/brun ≈ 6,00:1. |
| Placeholder | `cream-dark #EDE8DE` + gradient existant | aucun fallback pertinent | Ne pas simuler un produit. |
| Hero | blanc + noir 40 % | identique | Ajustable pour contraste mesuré. |

### Échelle d’espacement locale

- `9px` : micro-gap prix/CTA Figma.
- `12px` : gap/gouttière carte mobile.
- `15–16px` : média/nom et padding tablette/mobile.
- `20–21px` : grille et padding carte desktop.
- `24px` : gouttière tablette.
- `30–34px` : gouttière desktop.
- `44px` : cible interactive minimum.
- `56px` : respiration basse du hero desktop.
- `76px` : bande filtre desktop.

## Responsive, interactions et accessibilité

### États et interactions

- Hero : aucune interaction ni animation nécessaire.
- Filtre : défaut, hover, focus-visible et actif distincts ; navigation par liens réels, donc historique et URL conservés.
- Carte : hover image seulement sur dispositif pointeur ; focus-visible sur le lien et sur le bouton ; aucun hover requis sur tactile.
- Ajout panier : activation souris, tactile, `Enter` et `Space`; mise à jour du compteur et ouverture du tiroir sans navigation ni reload.
- Liste vide : conserver « Aucun produit disponible pour le moment. » et une hauteur lisible.
- Chargement/erreur : aucun nouvel état n’est défini par T16 ; ne pas inventer de skeleton ou message métier.
- Mouvement : respecter `prefers-reduced-motion`; les informations ne dépendent jamais d’une animation.

### Accessibilité

- Un seul `h1`, issu de `bannerTitle`; ordre de lecture : hero, catégories, sous-catégories éventuelles, grille.
- Encapsuler les filtres dans un `nav` nommé (« Catégories de produits », « Sous-catégories de farines »).
- Utiliser `aria-current="page"` sur le filtre actif ; l’état ne repose pas uniquement sur la couleur.
- Zones tactiles min `44×44px` pour catégories et CTA ; aucun chevauchement à 200 % de zoom.
- Focus visible de 2 px avec offset ; ne pas supprimer l’outline natif sans remplacement.
- Contraste texte normal ≥ 4,5:1, texte large ≥ 3:1, composants/focus ≥ 3:1.
- Images produit réelles : alt au minimum égal au nom réel ; fallback décoratif sans annonce. Hero décoratif si aucun alt éditorial vérifié n’existe.
- Le bouton répété « Ajouter au panier » reçoit un nom accessible contextualisé avec le produit.
- La navigation horizontale ne crée pas de piège clavier ; l’ordre DOM suit l’ordre visuel.
- Ne pas déclarer la page conforme WCAG à partir d’une capture : clavier, zoom, lecteur d’écran, contraste et focus doivent être testés.

## 9. Contraintes de non-régression

1. La nouvelle composition s’active uniquement pour `categorie === "farines"`.
2. La variante par défaut de tout composant partagé reste pixel-identique et fonctionnellement identique pour `/produits` et les six autres catégories live.
3. Les requêtes Supabase, `sort_order`, filtres `categorie`/`sous`, disponibilité et relations restent inchangés.
4. Aucun produit, prix, image, badge, sous-catégorie ou contenu Figma n’est ajouté au code ou aux données.
5. Les routes de fiche et l’appel `addItem(product)` restent inchangés.
6. Header, footer, SearchOverlay, SideCart et layout public ne sont pas redessinés par T16. Une correction partagée éventuelle doit être strictement neutre et validée par Théo.
7. Aucun token global n’est remplacé ; la piste B, si choisie, utilise des styles locaux encapsulés.
8. Le callout ne reçoit aucun asset Figma et ne change pas de destination sans validation.
9. Aucun changement de dépendance, schéma, RLS, commande, admin, Figma, remote data, merge ou déploiement.
10. Les tests existants continuent à réussir et de nouveaux tests Farines couvrent l’activation/exclusion de la variante.

## 10. Critères d’acceptation visuels et fonctionnels

Résultats autorisés pour la recette : `non testé`, `conforme`, `non conforme`, `bloqué`.

| ID | Viewport / état | Action | Résultat observable | Tolérance |
| --- | --- | --- | --- | --- |
| AC-01 | 1440×900, `categorie=farines` | Charger la page en haut | Hero de 465 px, voile sombre, texte bas gauche ; titre ~80 px et bloc ≤940 px. | Hauteur ±2 px ; gouttière ±4 px ; typo ±2 px. |
| AC-02 | 1440×900 | Inspecter la bande après hero | Bande de 76 px, catégories réelles, Farines active, aucune sous-catégorie/faux bouton si la donnée reste vide. | Hauteur ±2 px ; bordure 1 px. |
| AC-03 | 1440×900 | Mesurer la première ligne | 4 colonnes, conteneur ~1372 px, cartes ~327 px, gaps ~21 px. | Conteneur/carte ±4 px ; gap ±3 px. |
| AC-04 | 1440×900, carte avec fallback | Inspecter la carte | Fond brun/crème choisi, média carré, aucun asset ou texte Figma, nom/prix réels, CTA pleine largeur. | Image ratio 1:1 ±1 px ; CTA ≥44 px. |
| AC-05 | 768×1024 | Charger et parcourir | Hero ~420 px, catégories horizontalement scrollables, grille 2 colonnes, callout 2 colonnes, aucun chevauchement. | Hero ±12 px ; gap ±3 px. |
| AC-06 | 390×844 | Charger et faire défiler | Hero 380–400 px, 2 colonnes ~173 px, texte sans clipping, CTA ≥44 px, aucun débordement du body. | `documentElement.scrollWidth <= clientWidth + 1px`. |
| AC-07 | 359 px de large | Charger | Grille 1 colonne ; aucun contenu tronqué ou superposé. | Aucun scroll horizontal du body. |
| AC-08 | Toutes tailles | Comparer noms, ordre, prix, badges et images au payload | Le nombre et les valeurs affichés correspondent aux données Supabase courantes ; les absences utilisent les fallbacks prévus. | Zéro valeur fictive ; le nombre peut évoluer avec les données. |
| AC-09 | Farines avec `sous` réel | Activer un filtre | URL mise à jour, état actif visible et liste filtrée selon le contrat existant. | Pas de reload inattendu ni erreur console. |
| AC-10 | Une carte | Activer lien puis revenir | Le lien ouvre `/produits/{slug}` du produit réel. | URL exacte. |
| AC-11 | Une carte | Activer « Ajouter au panier » | Le compteur augmente, le tiroir s’ouvre et l’article réel est présent, sans reload. | Réponse perceptible ≤1 s hors latence système. |
| AC-12 | Clavier | Tabuler filtres, carte et CTA ; activer avec Enter/Space | Ordre logique, focus 2 px visible, aucun piège, contrôles activables. | Focus ≥3:1 ; cible ≥44×44 px. |
| AC-13 | Contraste | Mesurer hero, filtres, cartes et focus | Texte normal ≥4,5:1, grand texte ≥3:1, focus/composants ≥3:1. | Seuils WCAG, pas d’estimation visuelle seule. |
| AC-14 | `prefers-reduced-motion: reduce` | Survoler/focaliser une carte | Aucun zoom/transition non essentiel. | Transition supprimée ou quasi instantanée. |
| AC-15 | `/produits` et chaque autre catégorie | Capturer avant/après avec mêmes données et viewport | Rendu et comportement inchangés hors variation dynamique des données. | Diff visuelle 0 px sur zones stables ; toute différence expliquée. |
| AC-16 | 1440×900 et 390×844 | Comparer preview et Figma | Composition hero/filtre/grille/cartes cohérente avec les nœuds sources, en ignorant explicitement contenus et assets de démonstration. | Écarts intentionnels : tokens piste A, CTA +9 px, fallbacks réels. |

## Transmission conditionnelle à Gabriel

> Statut : **BLOQUÉ POUR LANCEMENT** par M-01 et M-02. Ce bloc prépare une transmission future ; Léonie ne lance pas Gabriel.

### Ce qui peut être préparé

- Introduire une détection locale `isFlourCategory = categorie === "farines"` dans la page produits.
- Encapsuler la présentation dans des branches/classes locales ou une prop de variante (`variant="farines"`) dont la valeur par défaut conserve strictement `ProductCard` actuel.
- Recomposer hero, filtre et grille avec les valeurs de la piste validée.
- Conserver les mêmes objets `product`, mêmes URLs, même logique de prix et même callback panier.
- Ajouter des tests ciblés pour Farines, sous-paramètre, panier, liens, clavier, overflow et non-régression des autres catégories.

### Ce qui ne doit pas être réalisé

- Copier des assets, noms, badges, prix, filtres ou textes du Figma.
- Corriger des prix, l’orthographe du CMS, les images ou les sous-catégories dans le code.
- Enrichir le callout sans source validée.
- Modifier tokens globaux, dépendances, Supabase, admin, autres catégories ou composants partagés sans neutralité démontrée.

### Séquence d’implémentation suggérée

1. Ajouter la condition Farines et prouver par test que les autres URLs gardent le DOM/classes actuels.
2. Adapter le hero avec les champs existants et les valeurs responsive du brief.
3. Adapter la bande catégories ; conserver le second niveau conditionnel.
4. Ajouter la variante de carte et le rythme 4/2/2/1 colonnes.
5. Préserver/encapsuler le callout selon la décision Julien.
6. Ajouter focus, noms accessibles, reduced motion et tests de débordement.
7. Générer la preview et remettre à Baptiste les trois viewports.

### Dépendances de décision

- Julien : piste A/B, responsive, callout, fallback sans images et écarts Figma.
- Théo : architecture de variante, neutralité du composant partagé, tests et éventuelle dette prix.
- Julien + Théo : tout choix UX qui modifierait la disponibilité/l’achat d’un produit à prix zéro.
- Pauline : qualification et autorisation de transmission.

## Checklist conditionnelle pour Baptiste

> DOCUMENT DE TRANSMISSION — NE VAUT NI LANCEMENT NI RÉSULTAT DE RECETTE

| ID | Viewport/contexte | Élément/état | Action | Résultat attendu | Tolérance | Résultat initial |
| --- | --- | --- | --- | --- | --- | --- |
| VIS-01 | 1440×900 | Hero | Capture haut de page | Correspond à AC-01 ; crop réel lisible. | AC-01 | non testé |
| VIS-02 | 1440×900 | Filtre + première grille | Capture | Correspond à AC-02/03 ; 4 cartes. | AC-02/03 | non testé |
| VIS-03 | 768×1024 | Page/reflow | Capture + scroll | Correspond à AC-05 ; aucun chevauchement. | AC-05 | non testé |
| VIS-04 | 390×844 | Page/reflow | Capture + scroll | Correspond à AC-06 ; aucun débordement. | AC-06 | non testé |
| VIS-05 | Desktop + mobile | Figma vs preview | Comparaison côte à côte | Évaluer composition seulement ; ignorer les données/assets Figma. | AC-16 | non testé |
| UX-01 | Clavier | Filtres/cartes/CTA | Tab + activation | Focus et ordre conformes à AC-12. | AC-12 | non testé |
| UX-02 | Tactile 390×844 | Filtres/CTA | Swipe + tap | Scroll local, cibles ≥44 px, pas de tap ambigu. | 44 px min | non testé |
| FUN-01 | Farines | Lien fiche | Ouvrir une carte | Slug exact et page répond. | AC-10 | non testé |
| FUN-02 | Farines | Ajout panier | Ajouter un produit | Compteur/tiroir/article mis à jour sans reload. | AC-11 | non testé |
| DATA-01 | Farines | Catalogue | Comparer au payload | Zéro donnée Figma/fictive ; ordre et valeurs réels. | AC-08 | non testé |
| A11Y-01 | Toutes tailles | Contraste/focus/alt | Outils + clavier | Seuils et alternatives selon AC-12/13. | WCAG indiqués | non testé |
| REG-01 | Général + 6 catégories | Avant/après | Captures ciblées + smoke tests | Aucun changement visuel/fonctionnel. | AC-15 | non testé |

Baptiste doit fournir les captures live/preview absentes de cette mission, notamment desktop et mobile demandées par l’issue. Aucune conformité visuelle ou accessibilité n’est présumée par ce document.

## Validations et décisions attendues

| ID | Décision | Autorité | Condition de déblocage |
| --- | --- | --- | --- |
| D-01 | Qualification et transmission de T16 | Pauline | Preuve GitHub explicite. |
| D-02 | Choisir piste A ou B | Julien | Commentaire citant la piste et le périmètre Farines. |
| D-03 | Valider 4/2/2/1 colonnes et tailles hero | Julien | Captures ou prototype aux trois viewports. |
| D-04 | Maintenir ou retirer le callout non enrichi | Julien | Décision de contenu explicite. |
| D-05 | Accepter l’état sans image et les fallbacks | Julien | Revue de la preview réelle. |
| D-06 | Architecture de variante et neutralité partagée | Théo | Revue code/tests. |
| D-07 | Traitement des produits à prix zéro | Julien + Théo, avec propriétaire des données | Décision hors code T16 et preuve de donnée. |
| D-08 | Matrice navigateurs et acceptation technique | Théo | Résultats CI/Playwright et QA. |
| D-09 | Acceptation des écarts Figma intentionnels | Julien | Revue comparative Baptiste. |

## 11. Risques, limites et interdictions appliquées

- Risque principal : une page fidèle en structure mais pauvre visuellement tant que les images réelles restent absentes.
- Risque métier : les prix à zéro peuvent être ajoutés au panier ; le brief ne les cache ni ne les corrige.
- Risque d’étendue : les longues sections éditoriales du Figma ne sont pas validées par l’acceptance de l’issue et restent exclues.
- Risque de non-régression : `ProductCard` et la page produits sont partagés ; une variante par défaut inchangée et des tests comparatifs sont obligatoires.
- Limite d’évidence : aucune capture live ; pas de conclusion sur le crop réel, le header mobile, le focus effectif ou le scroll horizontal actuel.
- Limite accessibilité : les exigences sont des critères à tester, pas une déclaration de conformité.
- Interdictions respectées : aucune modification de code applicatif, Figma, données, dépendances, GitHub Project, PR, merge ou déploiement ; aucun agent lancé.

## Journal et références de preuve

| Source | Référence exacte | Consultée le | Usage |
| --- | --- | --- | --- |
| S-01 | [GitHub issue #20 — T16](https://github.com/OrionStudioSAS/Moulin-de-balme/issues/20), issue ouverte, corps sans commentaires | 2026-08-12 | Objectif, scope, garde-fous, acceptance, autorités. |
| S-02 | [Figma frame `192:3835`](https://www.figma.com/design/LDtjvMJrN0kLFdvnjePwyS/0405---Moulin-de-Balme--copie-?node-id=192-3835), contexte et métadonnées ; sous-nœuds `229:4380`, `236:6621`, `229:4414`, `197:15`, `235:5255` | 2026-08-12 | Dimensions, composition, couleurs, typographie, distinction contenu de démo. |
| S-03 | [Live Farines](https://moulin-de-balme.vercel.app/produits?categorie=farines), HTML SSR public récupéré directement | 2026-08-12 | Catalogue réellement rendu, hero, absences d’images/badges/sous-catégories, prix. Aucune capture. |
| S-04 | `src/app/(public)/produits/page.tsx`, lignes 7–198 | 2026-08-12 | Requêtes, filtrage, hero, filtres, grille, callout. |
| S-05 | `src/components/ProductCard.tsx`, lignes 9–58 | 2026-08-12 | Média/fallback, badge, lien, prix, ajout panier. |
| S-06 | `src/components/ProductBadge.tsx`, lignes 1–17 | 2026-08-12 | Variantes et libellés badge. |
| S-07 | `tailwind.config.ts`, lignes 3–36 | 2026-08-12 | Breakpoints Tailwind par défaut, couleurs, font, tracking. |
| S-08 | `src/app/globals.css`, lignes 5–37 | 2026-08-12 | Base typographique, tokens et composants de bouton. |
| S-09 | `src/lib/cart-context.tsx`, lignes 35–101 | 2026-08-12 | Ajout, persistance, compteur et ouverture panier. |
| S-10 | `src/components/Navbar.tsx`, lignes 31–150 | 2026-08-12 | Header superposé, états scroll, navigation mobile. |
| S-11 | `tests/e2e/public-site.spec.ts`, lignes 32–128 | 2026-08-12 | Couverture publique actuelle. |
| S-12 | `playwright.config.ts`, projets `desktop-chromium` et `mobile-chromium` | 2026-08-12 | Viewports automatisés existants. |
| S-13 | `/Users/julienbourlieu/.superset/projects/orion-agent-os/agents/leonie/AGENT.md` et `prompts/system.md` | 2026-08-12 | Gouvernance, statut conditionnel, limites et handoff. |

### Évaluation Léonie v0.1

Auto-évaluation documentaire : `27/28` avant revue humaine.

- Provenance Pauline : `1/2` — source explicitement manquante et blocage correctement appliqué.
- Les 13 autres critères : `2/2` — faits/hypothèses/manques séparés, deux pistes, parcours, wireframe, responsive, accessibilité, transmissions, autorités, interdictions et journal présents.
- Ce score mesure la complétude du document ; il ne valide ni la direction créative, ni la faisabilité, ni le rendu.

### Handoff

- Pauline : fournir M-01 et autoriser ou non la transmission.
- Julien : trancher D-02 à D-05 et D-09.
- Théo : valider D-06 à D-08.
- Gabriel : n’utiliser la section de transmission qu’après ces validations.
- Baptiste : produire les captures et résultats `non testé/conforme/non conforme/bloqué` aux trois viewports, sans présumer la conformité.
