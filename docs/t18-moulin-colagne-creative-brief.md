# T18-LEONIE — Brief créatif et UX « Moulin de Colagne »

> DOCUMENT DE TRANSMISSION — PAS UNE AUTORISATION DE PUBLICATION
>
> Statut : **PRÉPARÉ — VALIDATIONS PAULINE ET JULIEN REQUISES**
>
> Le texte et les deux sources image du nœud Figma `235:5255` sont des références de composition uniquement. Aucun texte, fait, lien, média, droit ou attribut alternatif n'est approuvé par ce document.

## 1. Décision créative

La section transpose la composition éditoriale du Figma dans la **Piste A** déjà retenue pour Farines : surface `cream`, texte `brown`, Helvetica Neue et focus `gold`. Elle conserve le contraste entre un grand bloc typographique et une photographie carrée, sans reprendre les hexadécimaux, la police Inter, les positions absolues ni les contenus de démonstration du fichier source.

La section apparaît exclusivement sur `/produits?categorie=farines`, après tout le contenu du guide T17. Elle raconte un contexte de gamme après que le visiteur a vu les produits puis compris leur classification ; elle ne coupe donc ni la grille marchande ni le guide pédagogique.

Ce brief est assez précis pour préparer l'intégration, mais **Gabriel ne doit pas implémenter de contenu public** avant d'avoir :

1. la copie exacte validée par Pauline puis Julien ;
2. l'asset exact ou officiel validé, avec provenance et droits confirmés par Julien ;
3. le rôle de l'image et son texte alternatif validés ;
4. une destination CTA réelle validée, ou la décision explicite de l'omettre.

## 2. Sources consultées et faits de référence

Sources consultées le 12 août 2026 :

| ID | Source | Faits utilisables pour le design |
| --- | --- | --- |
| S-01 | Issue GitHub [#24 — T18](https://github.com/OrionStudioSAS/Moulin-de-balme/issues/24) | Portée Farines, validations humaines, trois viewports, interdiction d'inventer faits, liens et droits. |
| S-02 | Figma, contexte de design exact du [nœud `235:5255`](https://www.figma.com/design/LDtjvMJrN0kLFdvnjePwyS/0405---Moulin-de-Balme--copie-?node-id=235-5255) | Bloc source `1404 × 678 px` dans une enveloppe de `1441 × 714 px` ; contenu à gauche, média carré `678 × 678 px` à droite ; titre `81.8/81 px`, sous-titre `20.8/20 px`, corps `13/15.6 px`, CTA `280 × 46 px`. |
| S-03 | Métadonnées du frame Figma `192:3835` | Ordre source : grille produits, guide `197:15`, espace de `55 px`, section `235:5255`, espace de `55 px`, contenus de fin de page. |
| S-04 | `docs/t16-farines-creative-brief.md` | Piste A, gouttières, typographie, couleurs, focus, cible tactile et isolation Farines. |
| S-05 | `src/app/(public)/produits/page.tsx` | La grille est suivie du composant T17 ; la condition `isFlourCategory` existe ; conteneurs `1440/34 px` desktop, `24 px` tablette, `16 px` mobile. |
| S-06 | `src/components/FlourClassificationGuide.tsx` et `docs/t17-architecture-decision.md` | Le guide possède son propre `section`, un fond `cream-dark`, une bordure basse et un conteneur éditorial `1120 px`. |
| S-07 | `tailwind.config.ts` et `src/app/globals.css` | Tokens Piste A et pile typographique disponibles ; `.btn-outline` est une base réutilisable mais ne couvre pas à elle seule focus et réduction du mouvement. |

Le contexte de design Figma a été lu avant cette spécification. Son React/Tailwind généré a servi uniquement à mesurer la composition ; il ne constitue ni du code cible ni une source éditoriale.

## 3. Gouvernance du contenu

### Référence mise en quarantaine

Le nœud montre un titre, un sous-titre, un paragraphe long et un CTA. Il contient notamment « Moulin de Colagne », « 8 siècles d'histoire », des références à la santé, à des méthodes traditionnelles exclusives, à une transmission générationnelle, à un patrimoine de plus d'un siècle et à des produits authentiques, naturels ou d'exception.

Ces éléments restent **non publiables** tant que Pauline n'a pas séparé faits prouvés, discours de marque et formulations à retirer, puis que Julien n'a pas approuvé la version finale. Le brief ne les reformule pas et ne fournit aucune copie de remplacement.

### Contrat de longueur à remettre à Pauline

Les limites portent sur la copie finale validée, espaces compris. Elles protègent la géométrie mais ne justifient jamais d'ajouter ou de retirer un fait sans revue éditoriale.

| Champ | Limite | Comportement obligatoire |
| --- | --- | --- |
| Titre | `26` caractères maximum ; cible `1–2` lignes | Casse source conservée dans la donnée ; capitales visuelles par CSS ; aucun saut de ligne codé dans la chaîne. |
| Sous-titre | `70` caractères maximum ; cible `1–2` lignes desktop, `3` maximum mobile | Une seule phrase ou proposition ; aucune ellipse ni troncature. |
| Corps | `450–720` caractères ; un paragraphe | Maximum visuel cible de `9` lignes desktop à `506 px` ; reflow complet ailleurs ; aucune clamp. Si la copie dépasse 720 caractères, Pauline la révise avant intégration. |
| CTA | `42` caractères maximum ; une ligne | Libellé et destination validés ensemble ; ne pas réduire la taille pour faire entrer un libellé trop long. |
| Alt informatif | `125` caractères maximum | Décrit uniquement le contenu visible et pertinent validé ; n'identifie ni personne, ni lieu, ni époque sans preuve. |

## 4. Placement dans la page et ordre sémantique

### Placement contractuel

Ordre de rendu Farines :

1. hero et filtres T16 existants ;
2. grille produits complète, y compris le callout existant s'il est conservé ;
3. guide de classification T17 complet, sources incluses ;
4. espace de respiration ;
5. section éditoriale Moulin de Colagne T18 ;
6. espace de respiration ;
7. footer partagé existant.

T18 n'est jamais inséré entre des cartes produit, entre une carte et le callout, ni à l'intérieur de `FlourClassificationGuide`. Sur `/produits`, toute autre catégorie ou un état sans `categorie=farines`, il n'existe pas dans le DOM.

### Ordre DOM et titres

La section est un `section` autonome associé à son titre par `aria-labelledby`. Le titre est un `h2`, car le hero Farines fournit déjà le `h1`. L'ordre DOM ne change jamais selon le viewport :

1. `h2` ;
2. sous-titre ;
3. paragraphe ;
4. CTA, seulement s'il existe ;
5. image éditoriale.

Sur desktop, la grille CSS place le média dans la colonne droite sur toute la hauteur tandis que les deux groupes de texte occupent le haut et le bas de la colonne gauche. Sur tablette et mobile, l'ordre DOM devient naturellement l'ordre visuel. Aucun `order`, tabindex positif ou duplication de contenu n'est autorisé.

## 5. Géométrie et reflow

Toutes les mesures sont des cibles CSS calculées dans le viewport, pas des coordonnées absolues copiées depuis Figma. La hauteur vient du contenu et du ratio du média ; aucune hauteur fixe ne doit couper le texte.

### Desktop — `1024 px` et plus ; recette `1440 × 900`

- Espace depuis la bordure basse T17 : `56 px`.
- Conteneur : `1440 px` maximum, gouttières `34 px`, largeur utile `1372 px`.
- Grille : deux colonnes égales de `674 px`, gap `24 px`.
- Média : `674 × 674 px`, ratio `1:1`, aligné en haut de la grille.
- Colonne éditoriale : padding gauche local `12 px`, largeur de texte utile `662 px`, hauteur égale au média ; layout vertical `justify-between`.
- Groupe haut : titre puis sous-titre, gap `4 px`.
- Groupe bas : largeur du corps `506 px` maximum ; corps puis CTA avec gap `28 px`.
- CTA présent : `280 × 46 px`. CTA absent : aucun emplacement réservé ; le paragraphe reste ancré en bas.
- Espace entre la fin du média et le footer : `56 px`.

Cette transposition conserve le rythme source `678 px` tout en respectant les gouttières Piste A de la page réelle. Elle produit un écart intentionnel de `4 px` sur le carré Figma, préférable à un débordement ou à un mini-conteneur parallèle.

### Tablette — `768–1023 px` ; recette `768 × 1024`

- Espace après T17 : `48 px` ; gouttières `24 px` ; largeur utile `720 px`.
- Une colonne ; aucune zone en position absolue.
- Groupe titre/sous-titre, puis `40 px` avant le paragraphe.
- Corps limité à `560 px` pour garder une ligne confortable.
- Corps → CTA : `24 px`. CTA : `280 × 46 px`.
- Dernier élément textuel → média : `40 px`, que le CTA existe ou non.
- Média : largeur `720 px`, ratio `1:1`, hauteur automatique.
- Média → footer : `48 px`.

### Mobile — jusqu'à `767 px` ; recette `390 × 844`

- Espace après T17 : `40 px` ; gouttières `16 px` ; largeur utile `358 px`.
- Une colonne, sans largeur minimale et sans scroll horizontal.
- Groupe titre/sous-titre, puis `32 px` avant le paragraphe.
- Corps → CTA : `20 px`.
- CTA présent : largeur `100 %` (`358 px` à la recette), hauteur `46 px`.
- Dernier élément textuel → média : `32 px`, que le CTA existe ou non.
- Média : `358 × 358 px`, ratio `1:1`.
- Média → footer : `40 px`.

À `320 px`, les mêmes gouttières `16 px` s'appliquent, le CTA reste pleine largeur et toute la copie revient à la ligne. Il n'existe ni breakpoint spécial fondé sur un appareil, ni taille de police réduite pour masquer un dépassement.

## 6. Typographie et tokens Piste A

Famille unique : `font-sans`, soit `"Helvetica Neue", Helvetica, Arial, sans-serif`. Aucune police ni dépendance n'est ajoutée. Inter, présent dans le CTA Figma, n'est pas repris.

| Élément | `1440` | `768` | `390` | Couleur / règles |
| --- | --- | --- | --- | --- |
| Titre `h2` | `80/81 px`, `400`, tracking `0.016em` | `56/57 px`, `400` | `44/44 px`, `400` | `brown`; uppercase CSS ; marge `0`. |
| Sous-titre | `20/22 px`, tracking `0.016em` | `17/21 px` | `15/19 px` | `brown`; uppercase CSS ; pas de gras ajouté. |
| Corps | `13/15.6 px` | `15/22 px` | `15/22 px` | `brown` à 100 % ; graisse `400`. |
| CTA | `11/14 px`, `600`, tracking `0.15em` | identique | identique | `brown`/`cream`, uppercase CSS ; une ligne. |

Surface de section : `cream #F5F0E8`. Texte et bordure CTA : `brown #3D2B1F`. État hover CTA : fond `brown`, texte `cream`. Focus : `gold #C9A96E`. Les valeurs Figma `#FFF7EF` et `#3A312E` sont des références proches, pas de nouveaux tokens.

## 7. Image : asset, cadrage et alternative

### Décision de rôle

La recommandation Léonie est **image informative**, car le média participe au récit du moulin au lieu de servir de simple texture. Pauline et Julien doivent confirmer ce rôle. Tant que l'alt exact et les droits ne sont pas validés, la section n'est pas publiable avec cette image.

Si Julien décide finalement que le média n'apporte aucune information au-delà de la copie adjacente, l'unique alternative acceptable est `alt=""` et aucun `figcaption`. Il est interdit d'utiliser le titre de section comme alt automatique.

### Source et droits

- Utiliser uniquement l'export exact validé parmi les sources du nœud ou un média officiel équivalent fourni par Julien.
- Ne pas committer une URL temporaire `figma.com/api/mcp/asset/...` ; Gabriel télécharge et versionne les octets approuvés après validation.
- Consigner source, propriétaire, droit d'utilisation web, crédit éventuel et date de validation dans la future PR.
- Ne pas recréer, retoucher, générer ou substituer l'image. Les deux couches image du nœud doivent être clarifiées : Julien désigne le fichier maître, Gabriel vérifie qu'un seul rendu visuel est nécessaire.

### Cadrage

- Ratio rendu `1:1` aux trois recettes ; `object-fit: cover`.
- Point focal : à définir sur l'asset maître validé, puis conserver le même pourcentage `object-position` à tous les viewports. Le point focal ne doit pas être deviné depuis le nom du fichier.
- Le cadrage doit conserver les sujets visuels approuvés sans couper tête, visage ou élément métier déclaré essentiel par Julien.
- Pas de filtre couleur, voile, parallaxe, zoom, rayon, ombre ou animation.
- Utiliser le composant `next/image` existant avec `sizes` cohérent ; le chargement est paresseux puisque la section est située sous la grille et T17.

## 8. CTA et états d'interaction

### Destination validée

Rendre un vrai lien seulement lorsque Pauline fournit le libellé et que Julien valide une URL interne ou externe réelle. Le nom accessible est le libellé visible, sauf précision éditoriale validée. Ne pas ouvrir un nouvel onglet par défaut.

États :

- défaut : fond transparent, bordure `1 px brown`, texte `brown` ;
- hover, uniquement sur pointeur fin : fond `brown`, texte `cream` ;
- focus-visible : outline `2 px gold`, offset `2 px`, contraste composant au moins `3:1` ;
- actif : fond `brown-dark`, texte `cream`, sans déplacement géométrique ;
- visité : même apparence que défaut, pas de violet navigateur ;
- cible tactile : minimum `44 × 44 px`, cible réelle ici `46 px` de haut ;
- transition de couleur : `150 ms` maximum, aucune transformation.

### Destination absente

**Omettre entièrement le CTA.** Ne pas rendre de faux bouton, `href="#"`, lien vers `/produits`, état `disabled`, `aria-disabled`, texte neutralisé ou destination déduite. La mise en page ne réserve aucun trou de `46 px`.

### Mouvement réduit

La section n'a ni apparition, ni parallaxe, ni animation d'image. Sous `prefers-reduced-motion: reduce`, la transition de couleur du CTA devient instantanée. Aucune information ou confirmation ne dépend du mouvement.

## 9. Réemploi proposé, sans implémentation

Le futur développement peut réutiliser :

- `isFlourCategory` dans la page produits pour l'isolation de rendu ;
- les conteneurs Piste A `max-w-[1440px]`, `px-[34px]`, `md:px-6`, `px-4` ;
- les tokens Tailwind `cream`, `brown`, `brown-dark`, `gold` et `font-sans` ;
- `next/image` et son pattern `fill/object-cover` ou un wrapper à ratio explicite ;
- `.btn-outline` comme base visuelle seulement, complétée localement par `min-h-11`, focus-visible, état actif, tracking `0.15em` et `motion-reduce:transition-none` ;
- le modèle T17 d'un composant de section autonome et d'un contrat de contenu explicite/versionné, si Théo le confirme pour T18.

Ne pas réutiliser `ProductCard`, le callout « Recette du moment », la donnée Supabase de bannière ou un champ arbitraire comme source de la copie/du lien T18. Aucun token global n'est modifié.

## 10. Tolérances Pixel Perfect et recette

Les captures sont faites page chargée, polices stabilisées, à zoom navigateur `100 %`, sans émulation de scrollbar artificielle. Les hauteurs de page sont variables : la recette mesure la section après l'avoir amenée dans le viewport, elle ne suppose pas que T18 soit visible au premier écran.

| ID | Recette | Mesure attendue | Tolérance |
| --- | --- | --- | --- |
| PP-01 | `1440×900` | Ordre DOM : grille puis T17 puis T18 ; T18 absent ailleurs. | Zéro inversion, duplication ou occurrence hors Farines. |
| PP-02 | `1440×900` | Espace T17→T18 `56 px`, gouttières `34 px`, largeur `1372 px`. | Espaces/gouttières `±4 px`, largeur `±4 px`. |
| PP-03 | `1440×900` | Deux colonnes `674 px`, gap `24 px`, média carré `674 px`. | Colonnes/média `±4 px`, gap `±3 px`, écart ratio largeur/hauteur `≤1 px`. |
| PP-04 | `1440×900` | Titre `80/81 px`, départ titre et média alignés ; groupe bas aligné au bas du média. | Typo `±2 px`, alignements `±3 px`. |
| PP-05 | `1440×900` | Corps `≤506 px`, CTA `280×46 px` si présent. | Largeur `±4 px`, hauteur CTA `±2 px` et jamais `<44 px`. |
| PP-06 | `768×1024` | Une colonne de `720 px`, gouttières `24 px`, média carré `720 px`. | Gouttières `±2 px`, largeur `±4 px`, ratio `≤1 px`. |
| PP-07 | `768×1024` | Espace T17→T18/footer `48 px`, titre `56/57 px`, texte et CTA complets. | Espaces `±4 px`, typo `±2 px`, zéro clipping. |
| PP-08 | `390×844` | Une colonne de `358 px`, gouttières `16 px`, média `358×358 px`, CTA pleine largeur si présent. | Gouttières `±2 px`, média/CTA `±2 px`, ratio `≤1 px`. |
| PP-09 | `390×844` | Espace T17→T18/footer `40 px`, titre `44/44 px`, reflow intégral. | Espaces `±4 px`, typo `±2 px`, zéro chevauchement. |
| PP-10 | Trois recettes | Largeur document. | `scrollWidth <= clientWidth + 1 px`. |
| PP-11 | Trois recettes | Texte rendu intégral, sans clamp/ellipsis ; titre, sous-titre, corps et CTA correspondent au contrat approuvé. | Zéro caractère inventé, omis ou tronqué. |
| PP-12 | Clavier | Tab atteint le CTA seulement s'il existe ; focus visible ; activation `Enter`. | Outline calculé `2 px`, ordre identique au DOM. |
| PP-13 | Tactile | CTA activable sans chevauchement. | Boîte interactive `≥44×44 px`. |
| PP-14 | Mouvement réduit | Aucun mouvement d'image/section ; changement CTA instantané. | Durée calculée `0 s` pour les transitions concernées. |

Les couleurs calculées doivent correspondre exactement aux tokens Piste A. Contrastes minimaux : texte normal `4.5:1`, grand texte `3:1`, bordure/focus interactif `3:1` avec les surfaces adjacentes.

## 11. No-go et non-régression

- Ne modifier ni l'application, ni Figma, ni Supabase, ni les dépendances, ni les données distantes dans T18-LEONIE.
- Ne modifier ni T17, ni la PR #21, ni les autres catégories, ni le hero, les filtres, la grille, le guide, le header, le footer ou le panier.
- Ne publier aucune allégation historique, sanitaire, nutritionnelle, réglementaire, artisanale ou commerciale sans preuve et validation.
- Ne copier aucun texte, lien, asset ou alt depuis le Figma comme donnée finale.
- Ne pas afficher la section à cause d'un nom de catégorie traduit, d'un produit ou d'un contenu Supabase ; l'activation reste le slug exact `farines`.
- Ne pas rendre la section si les champs validés indispensables au contrat choisi manquent. Un CTA absent est permis ; une copie ou un média non approuvé ne l'est pas.
- Ne pas ajouter de carrousel, accordéon, vidéo, animation, décoration, changement de thème ou interaction non demandée.

## 12. Évaluation Léonie

| Critère | Résultat | Preuve / réserve |
| --- | --- | --- |
| Fidélité au nœud exact | Conforme pour spécification | Contexte de design `235:5255` lu ; géométrie et composition transposées. |
| Cohérence Piste A | Conforme | Tokens existants uniquement ; écart de largeur documenté. |
| Placement T16/T17 | Conforme | Ordre du frame source et ordre du code T17 vérifiés. |
| Responsive et sémantique | Conforme pour brief | Un seul DOM, reflow `2 colonnes → 1`, sans position absolue. |
| Accessibilité interaction/média | Conforme sous conditions | Règles arrêtées ; alt et rôle final du média attendent validation. |
| Gouvernance éditoriale | Conforme | Copie Figma mise en quarantaine ; limites et autorités explicites. |
| Prêt à publier | **Non** | Copie, preuves, asset/droits, alt, destination CTA et recette humaine manquants. |

Il n'existe pas de commande d'évaluation Léonie déclarée dans `package.json`; l'évaluation applicable est donc la revue de mandat ci-dessus. Son résultat est **orange : brief transmissible pour validation, implémentation/publication non autorisée**.

## 13. Passage de relais

### Pauline

- livrer les quatre champs exacts ou constater explicitement l'absence de CTA ;
- sourcer chaque affirmation et retirer toute formulation non démontrable ;
- proposer l'alt selon le rôle retenu, sans identifier un sujet non prouvé.

### Julien

- approuver la copie, le média maître, ses droits, le rôle/alt, le point focal, le CTA et le rendu aux trois recettes ;
- confirmer qu'un CTA sans destination reste omis.

### Gabriel, après validations seulement

- créer une section autonome, statique et isolée à `isFlourCategory` ;
- versionner l'asset approuvé, sans URL Figma temporaire ;
- respecter l'ordre `grille → T17 → T18`, les tokens et toutes les tolérances ;
- ne toucher ni T17, ni Supabase, ni aux autres catégories.

### Baptiste

- fournir captures et mesures à `1440×900`, `768×1024`, `390×844` ;
- tester absence hors Farines, contenu exact, crop, alt, CTA conditionnel, clavier, tactile, contraste, zoom `200 %`, réduction du mouvement et absence de débordement ;
- comparer au nœud Figma comme référence visuelle, jamais comme source de vérité éditoriale.

### Théo

- valider le contrat de composant/contenu, le traitement image, la performance, l'accessibilité, les tests et la non-régression avant toute fusion.
