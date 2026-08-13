# T17-PAULINE — Contrat de contenu du guide de classification des farines

> **STATUT : CONDITIONNEL — REVUE JULIEN ET THÉO REQUISE AVANT PUBLICATION**
> Mission `T17-PAULINE`, qualification réalisée le 12 août 2026 sur la branche
> `feature/t17-flour-classification`, à partir du commit T16 `11aac5e`. Ce document
> autorise la préparation du développement, mais ne vaut ni validation éditoriale,
> ni validation réglementaire, ni autorisation de publication.

## 1. Résumé de la mission

- Le catalogue public rend 19 produits Farines ; 15 portent explicitement au moins un type et sept jetons distincts sont observés : `T55`, `T65`, `T80`, `T90`, `T100`, `T130`, `T150`.
- Le mock Playwright rend huit produits génériques sans type ; aucun champ structuré ne porte l'espèce, le type, le taux de cendres ou l'usage.
- Le socle publiable le plus sûr comporte quatre cartes de **farines de blé réellement présentes** : `T55`, `T65`, `T80`, `T150`.
- `T90`/`T130` de seigle et `T80`/`T100` d'épeautre restent hors copie publique tant que leur référentiel et la donnée produit ne sont pas vérifiés ; le libellé `T90 & T130` est particulièrement incohérent avec une fiche sans variation.
- Prochaine validation : Julien approuve la copie et les recommandations d'usage ; Théo approuve les sources réglementaires, les mappings et le modèle de données ; toute publication attend les deux.

## 2. Périmètre et niveau d'autonomie

### Inclus

- inventaire en lecture seule du mock local et du catalogue public rendu ;
- vérification des types écrits explicitement dans les noms de produits ;
- recherche de sources primaires ou institutionnelles françaises ;
- copie candidate exacte, règles de mapping, hiérarchie responsive, manques,
  risques, no-go et décisions humaines.

### Exclu

- toute modification de l'application, de Figma, de Supabase, des dépendances,
  des données distantes ou de la PR #21 ;
- toute déduction d'un type à partir de mots tels que « complète », « bise »,
  « gruau », « meule », « bio », d'une céréale ou d'un usage ;
- toute allégation sanitaire ou nutritionnelle ;
- toute validation juridique, certification produit ou attestation de conformité.

### Autonomie

| Action | Niveau | Responsable proposé | Validation / limite |
| --- | --- | --- | --- |
| Utiliser ce contrat pour préparer une implémentation locale | Vert | Gabriel, à confirmer | Respect mot pour mot du contenu validé et des exclusions. |
| Valider le ton, les usages et l'ordre de lecture | Orange | Julien | Décision éditoriale explicite requise. |
| Valider plages, mapping et source de données | Orange | Théo | Revue technique et réglementaire explicite requise. |
| Ajouter un type non vérifié ou publier | Rouge | Aucun agent | Validation conjointe Julien + Théo requise. |
| Modifier catalogue, Figma, PR, production ou déployer | Rouge | Hors mission Pauline | Toujours interdit dans cette mission. |

## 3. Faits vérifiés

### 3.1 Contrat de données existant

1. La page charge `products` depuis Supabase, filtre côté serveur rendu selon la
   catégorie et affiche le `name` et le `slug` des produits ; elle n'extrait aucun
   type de farine (`S-02`).
2. Le type TypeScript `Product` et la migration initiale ne définissent aucun champ
   `flour_type`, `cereal_species`, `ash_rate` ou `recommended_uses` (`S-03`).
3. Le mock local crée huit produits Farines nommés `Farines fixture 1` à
   `Farines fixture 8`, avec `subtitle: null`, `ingredients: null` et aucune
   classification (`S-04`). Le mock démontre donc **zéro type**, pas huit produits
   classables.
4. Le HTML public rendu le 12 août 2026 contient 19 cartes Farines et le payload
   produit associé. Quinze noms portent un type explicite ; quatre n'en portent pas
   (`S-05`).
5. La fiche rendue `Farine de seigle T90 & T130` a `variations: []`. Rien dans le
   payload observé n'indique comment choisir entre les deux types (`S-05`).

### 3.2 Types démontrablement présents

Le mot **présent** signifie seulement « jeton écrit dans le nom public rendu ». Il
ne vaut pas contrôle analytique, conformité réglementaire ou certification.

| Jeton | Occurrences produit | Espèce explicitement rendue ou décrite | Statut de contenu |
| --- | ---: | --- | --- |
| `T55` | 2 | Blé pour les deux descriptions ; l'un est nommé « gruau » | Carte blé candidate ; aucune affirmation propre au gruau. |
| `T65` | 3 | Blé explicite dans le nom ou la description | Carte blé candidate. |
| `T80` | 5 | Quatre blés ; un petit épeautre | Carte blé candidate pour quatre produits seulement ; petit épeautre bloqué. |
| `T90` | 1 | Seigle, dans le libellé combiné `T90 & T130` | Bloqué : donnée combinée sans variation et référentiel primaire non vérifié. |
| `T100` | 1 | Grand épeautre | Bloqué : ne pas appliquer les plages du blé. |
| `T130` | 2 | Seigle ; une occurrence seule et une combinée | Identité produit certaine ; plage et copie publique bloquées. |
| `T150` | 2 | Blé explicite dans le nom ou la description | Carte blé candidate. |

Les quatre produits sans jeton sont `Farine petit épeautre`, `Farine Khorasan`,
`Farine de sarrasin` et `Farine 7 graines 7 céréales`. Aucun type ne doit leur être
attribué.

### 3.3 Inventaire produit et confiance du mapping

Échelle : **haute** = type et espèce écrits dans le nom, ou type dans le nom et
espèce explicitée par la description rendue ; **bloquée** = le jeton existe, mais
son sens ne peut pas hériter sûrement du référentiel blé ou la donnée est
incohérente. Les slugs sont ceux du HTML public du 12 août 2026.

| Type | Produit rendu | Slug | Preuve espèce | Confiance / règle |
| --- | --- | --- | --- | --- |
| `T55` | Farine T55 | `farine-t55` | description : farine de blé | Haute ; lien autorisable dans la carte blé T55. |
| `T55` | Farine de gruau T55 | `farine-gruau-t55` | description : farine de blé | Haute pour T55/blé ; ne rien affirmer sur « gruau ». |
| `T65` | Farine de blé T65 | `farine-ble-t65` | nom | Haute. |
| `T65` | Farine T65 Bio | `farine-t65-bio` | description : blé tendre | Haute pour T65/blé ; ne pas dériver de promesse du mot « Bio ». |
| `T65` | Farine de blé T65 Label Rouge | `farine-ble-t65-label-rouge` | nom | Haute pour T65/blé ; ne pas développer de promesse Label Rouge. |
| `T80` | Farine de blé T80 | `farine-ble-t80` | nom | Haute. |
| `T80` | Farine de blé T80 Label Rouge | `farine-ble-t80-label-rouge` | nom | Haute pour T80/blé seulement. |
| `T80` | Farine de blé bio T80 | `farine-ble-bio-t80` | nom | Haute pour T80/blé seulement. |
| `T80` | Farine de blé T80 Label Rouge classique | `farine-ble-t80-label-rouge-classique` | nom | Haute pour T80/blé seulement. |
| `T80` | Farine Petit Épeautre bio T80 | `farine-petit-epeautre-bio-t80` | nom | Bloquée : ne pas lui appliquer la plage ou l'appellation du blé T80. |
| `T90` + `T130` | Farine de seigle T90 & T130 | `farine-seigle-t90-t130` | nom ; `variations: []` | Bloquée : type achetable non déterminé ; ne pas créer deux liens ou deux produits. |
| `T100` | Farine Grand Épeautre bio T100 | `farine-grand-epeautre-bio-t100` | nom | Bloquée : référentiel de type non vérifié. |
| `T130` | Farine de seigle T130 | `farine-seigle-t130` | nom | Haute pour l'identité seigle/T130 ; plage, appellation et usages bloqués. |
| `T150` | Farine T150 complète | `farine-t150-complete` | description : farine de blé | Haute ; lien autorisable dans la carte blé T150. |
| `T150` | Farine de blé bio T150 | `farine-ble-bio-t150` | nom | Haute. |

### 3.4 Classification et taux de cendres : faits publiables après validation

- L'arrêté du 13 juillet 1963 homologue les types de farine de blé en fonction de
  leurs caractéristiques (`S-06`). Le décret n° 63-720 associé est abrogé depuis
  le 1er juillet 2016 ; il ne doit pas être cité comme un décret en vigueur
  (`S-10`).
- FranceAgriMer décrit les types homologués comme des plages de taux de cendres,
  en pourcentage ramené à la matière sèche, et relie la teneur en cendres à la
  matière minérale et à la proportion d'enveloppe du grain (`S-07`).
- La norme française en vigueur NF EN ISO 2171 (mars 2023) porte sur la
  détermination du taux de cendres par incinération (`S-08`). La copie peut donc
  expliquer la méthode sans détailler température, durée ou protocole.
- Le cahier des charges « Farine de meule » homologué par arrêté du 23 janvier
  2025 reproduit les plages et appellations ci-dessous (`S-09`). Il fournit aussi
  des exemples d'usage ; ces derniers restent des **repères éditoriaux**, pas une
  obligation réglementaire ni une garantie de résultat culinaire.

| Type de blé présent | Taux de cendres, matière sèche | Appellation institutionnelle | Repère d'usage institutionnel, à valider par Julien |
| --- | --- | --- | --- |
| `T55` | 0,50 % à 0,60 % | Farine blanche | Pain, biscottes, viennoiseries. |
| `T65` | 0,62 % à 0,75 % | Farine blanche | Pain de tradition française, biscuiterie. |
| `T80` | 0,75 % à 0,90 % | Farine bise | Pain bis et autres applications spéciales. |
| `T150` | Au-dessus de 1,40 % | Farine complète | Pains complets, spéciaux et autres. |

Les plages ne forment pas une échelle continue : le texte source laisse notamment
des intervalles entre certaines classes. Ne pas combler ni arrondir ces espaces.

## 4. Copie candidate exacte

> **COPIE SÛRE POUR REVUE, NON ENCORE APPROUVÉE POUR PUBLICATION.**
> Julien doit valider le titre, le ton et les usages. Théo doit valider les plages,
> leur portée « farine de blé » et les liens produits. Après validation, Gabriel
> doit reprendre les chaînes ci-dessous sans les enrichir.

### Titre et introduction

**Comprendre les types de farine**

> Le « T » se lit « type ». Pour les farines de blé, chaque type correspond à une
> plage de taux de cendres, exprimée en pourcentage de matière sèche. Ce taux est
> déterminé par incinération et il est corrélé à la quantité de matières minérales
> de la farine. Dans cette classification, un type plus élevé correspond à un taux
> de cendres plus élevé.

**Repères pour nos farines de blé**

### Cartes

#### Type 55

- **Appellation :** Farine blanche
- **Taux de cendres :** De 0,50 % à 0,60 % de matière sèche
- **Idées d'usage :** Pain, biscottes et viennoiseries
- **Produits associés :** Farine T55 ; Farine de gruau T55

#### Type 65

- **Appellation :** Farine blanche
- **Taux de cendres :** De 0,62 % à 0,75 % de matière sèche
- **Idées d'usage :** Pain de tradition française et biscuiterie
- **Produits associés :** Farine de blé T65 ; Farine T65 Bio ; Farine de blé T65 Label Rouge

#### Type 80

- **Appellation :** Farine bise
- **Taux de cendres :** De 0,75 % à 0,90 % de matière sèche
- **Idées d'usage :** Pain bis et autres applications spéciales
- **Produits associés :** Farine de blé T80 ; Farine de blé T80 Label Rouge ; Farine de blé bio T80 ; Farine de blé T80 Label Rouge classique

#### Type 150

- **Appellation :** Farine complète
- **Taux de cendres :** Au-dessus de 1,40 % de matière sèche
- **Idées d'usage :** Pains complets, spéciaux et autres
- **Produits associés :** Farine T150 complète ; Farine de blé bio T150

### Note de portée

> Ces repères concernent ici les farines de blé. Les types indiqués sur nos farines
> de seigle et d'épeautre ne sont pas comparés dans ce guide tant que leurs données
> de référence ne sont pas confirmées.

La mention « Idées d'usage » est obligatoire si les usages sont conservés : ne pas
la remplacer par « Pour », « Idéal pour », « Parfait pour » ou une promesse de
résultat. Les noms produit restent les noms de catalogue exacts et chaque lien doit
utiliser le slug du tableau de mapping.

## 5. Hiérarchie responsive du contenu

La hiérarchie suivante est un contrat de lecture, pas une maquette :

1. titre de section `h2` ;
2. introduction en un paragraphe ;
3. intertitre « Repères pour nos farines de blé » ;
4. liste des quatre types dans l'ordre croissant `55`, `65`, `80`, `150` ;
5. dans chaque item : type (`h3`), appellation, taux, « Idées d'usage », puis
   produits associés sous forme de liens nommés ;
6. note de portée après la liste ;
7. sources accessibles depuis une mention courte ou la zone éditoriale prévue par
   le design, sans masquer la provenance.

| Viewport de recette | Ordre et densité attendus | No-go responsive |
| --- | --- | --- |
| `1440×900` | Quatre cartes comparables sur une rangée si la largeur réelle le permet ; mêmes positions internes. | Aucun texte tronqué ; pas d'infobulle indispensable. |
| `768×1024` | Grille 2 × 2 ou liste ; ordre de lecture DOM 55 → 65 → 80 → 150. | Ne pas réordonner visuellement les cartes par rapport au DOM. |
| `390×844` | Une carte par rangée ; libellés et noms produit reviennent à la ligne. | Aucun carrousel, tableau large, scroll horizontal ou contenu uniquement révélé au survol. |

Les liens produits éventuels doivent rester accessibles au clavier et avoir comme
nom accessible le nom produit exact. Aucun filtre ou accordéon n'est requis par le
contenu ; si Léonie en propose un, Julien valide l'éditorial et Théo/l'équipe QA
valident ordre de focus, état ouvert et restitution sans JavaScript.

## 6. Informations manquantes et blocages

### Bloquantes avant publication

| ID | Manque / incohérence | Effet | Propriétaire de décision |
| --- | --- | --- | --- |
| M-01 | Validation explicite de la copie et des usages | La copie reste candidate. | Julien |
| M-02 | Validation de l'applicabilité actuelle des plages et de leur portée blé | Aucun taux ne doit être publié sans elle. | Théo |
| M-03 | Source de données explicite pour espèce, type et mapping | Parser le nom en production est interdit. | Théo |
| M-04 | Résolution de `Farine de seigle T90 & T130` alors que `variations: []` | Impossible d'associer un type achetable ou deux cartes. | Propriétaire catalogue + Théo |
| M-05 | Texte primaire exploitable et à jour pour les types de seigle | Pas de plage, appellation ou usage T130 ; T90 reste suspect. | Théo, puis Julien pour la copie |
| M-06 | Référentiel primaire des types appliqués au grand/petit épeautre | Aucun transfert des règles du blé vers T80/T100 d'épeautre. | Théo, puis Julien |
| M-07 | Validation conjointe du périmètre à quatre cartes de blé | Décide si la première version peut exclure provisoirement seigle/épeautre. | Julien + Théo |

### Importantes avant production

- méthode de maintien des mappings quand un produit est renommé, masqué ou ajouté ;
- propriétaire métier des contenus et procédure de revalidation des sources ;
- comportement quand aucun produit vérifié n'est disponible pour une carte ;
- destination exacte et état accessible des liens produits ;
- preuve que la section est rendue uniquement pour `categorie=farines`.

### Secondaires avant livraison

- forme visuelle finale des sources ;
- choix 4 colonnes ou autre présentation desktop, tant que la hiérarchie reste
  conforme ;
- microcopie d'un éventuel lien global « Voir toutes nos farines », qui n'est pas
  nécessaire au guide.

## 7. No-go éditoriaux et données interdites

Ne pas publier, reformuler ou laisser entendre :

- « meilleur pour la santé », « bon pour la santé », « très digeste », « riche en
  protéines », « plus nutritive », toute promesse sur les fibres, vitamines,
  glycémie, digestion ou satiété ;
- qu'un type élevé est « meilleur », « plus sain » ou adapté à toutes les recettes ;
- que le nombre après `T` est un pourcentage, une quantité de minéraux ou le taux
  d'extraction ;
- que les mêmes plages et appellations valent automatiquement pour blé, seigle,
  épeautre, sarrasin, Khorasan ou mélanges ;
- que `T90` est un type de seigle réglementaire vérifié, ou que la fiche combinée
  `T90 & T130` représente deux produits/variations ;
- que « complète », « bio », « Label Rouge », « meule de pierre », « gruau » ou un
  usage permet de déduire un type absent ;
- une plage T45 ou T110 : ces types existent dans les sources générales, mais aucun
  produit T45/T110 n'est rendu dans la gamme observée ;
- les exemples, produits, visuels ou textes de démonstration du Figma comme données
  réelles ;
- le décret n° 63-720 comme texte actuellement en vigueur : Légifrance l'indique
  abrogé depuis le 1er juillet 2016.

Le payload public contient déjà des formulations nutritionnelles ou sanitaires
dans certains produits et dans la bannière Farines. Elles sont hors périmètre de
ce contrat, ne sont ni validées ni reprises, et T17 ne doit pas les propager.

## 8. Hypothèses et risques

### Hypothèses explicitement non validées

- Une première version limitée aux quatre types de blé fournirait assez de valeur
  malgré l'exclusion temporaire des produits seigle/épeautre.
- Les usages du cahier des charges institutionnel sont adaptés au ton commercial du
  Moulin une fois reformulés en « Idées d'usage ».
- Une source statique versionnée peut être préférable à un parsing de noms ; le
  choix d'architecture appartient à Théo.

### Risques et réduction

| Risque | Réduction obligatoire |
| --- | --- |
| Application erronée d'une plage blé à une autre céréale | Clé composée espèce + type ; produits non-blé exclus tant que non vérifiés. |
| Dérive éditoriale des usages en promesse | Conserver « Idées d'usage », chaînes exactes et revue Julien. |
| Catalogue renommé après validation | Mapping stable et explicite, test de correspondance, propriétaire de donnée. |
| Source historique présentée comme droit actuel | Faire valider l'applicabilité par Théo ; citer aussi les sources institutionnelles 2023/2025. |
| Guide incomplet pour le seigle/épeautre | Note de portée transparente ; ne pas masquer l'incomplétude. |
| Allégation santé importée depuis le catalogue | Liste de no-go et test exact des textes du guide. |

## 9. Critères d'acceptation du contenu

- [ ] Julien a approuvé explicitement le titre, l'introduction, les quatre cartes,
  la note de portée et chaque « Idée d'usage ».
- [ ] Théo a approuvé explicitement les plages, sources, espèces et mappings.
- [ ] La copie rendue correspond exactement à la section 4, hors corrections
  approuvées et consignées dans la PR de développement.
- [ ] Seuls `T55`, `T65`, `T80` et `T150` de blé figurent dans la première version,
  sauf décision ultérieure sourcée Julien + Théo.
- [ ] Les 11 produits blé autorisés pointent vers les slugs exacts du mapping ;
  aucun produit non-blé ou sans type n'est associé à ces cartes.
- [ ] Aucun type n'est extrait dynamiquement du nom d'un produit.
- [ ] Aucune allégation nutritionnelle ou sanitaire n'apparaît dans le guide.
- [ ] Les usages sont visuellement et sémantiquement présentés comme des idées, pas
  comme des règles ou garanties.
- [ ] L'ordre de lecture et les contenus restent complets à `390×844`, `768×1024`
  et `1440×900`, sans débordement horizontal et avec navigation clavier.
- [ ] La section n'apparaît que sur `/produits?categorie=farines` ; la page générale
  et les autres catégories restent inchangées.
- [ ] Les sources et leur date de consultation restent traçables dans le dépôt.

## 10. Décisions attendues de Julien et Théo

| ID | Décision | Autorité | Preuve attendue |
| --- | --- | --- | --- |
| D-J01 | Approuver ou corriger la copie exacte, notamment « Idées d'usage ». | Julien | Commentaire écrit citant la version du document. |
| D-J02 | Accepter les appellations « blanche », « bise », « complète » dans le ton du Moulin. | Julien | Validation éditoriale explicite. |
| D-J03 | Accepter l'exclusion transparente et provisoire du seigle/épeautre. | Julien | Validation du périmètre public. |
| D-T01 | Confirmer l'applicabilité actuelle des plages et le statut des textes cités. | Théo | Revue sourcée ; avis juridique externe si jugé nécessaire. |
| D-T02 | Choisir la source maintenable du guide et interdire le parsing du nom. | Théo | Contrat de données ou constante versionnée revue. |
| D-T03 | Résoudre la fiche `T90 & T130` et déterminer si T90 est une erreur de donnée. | Théo + propriétaire catalogue | Donnée corrigée ou décision documentée, sans mutation dans T17-PAULINE. |
| D-T04 | Valider isolation Farines, liens, tests, accessibilité et non-régression. | Théo | Revue de la future PR de développement. |
| D-JT01 | Autoriser ultérieurement une carte seigle/épeautre. | Julien + Théo | Source primaire, mapping produit, copie et tests validés. |
| D-JT02 | Autoriser la publication du guide. | Julien + Théo | Validation explicite de la future PR ; l'absence de réponse ne vaut pas accord. |

## 11. Journal de preuves et sources

Toutes les sources ont été consultées le **12 août 2026**. Les liens externes sont
donnés pour traçabilité ; aucune source secondaire commerciale n'est utilisée pour
autoriser une affirmation publique.

| ID | Source | Preuve / usage | Limite |
| --- | --- | --- | --- |
| S-01 | [GitHub issue #22 — T17](https://github.com/OrionStudioSAS/Moulin-de-balme/issues/22) | Objectif, scope, critères, validations Julien/Théo. | Issue ouverte, aucun commentaire au moment de la lecture. |
| S-02 | `src/app/(public)/produits/page.tsx` au commit `11aac5e` | Requêtes Supabase, filtre Farines, rendu par nom/slug. | Code local, pas preuve de conformité des données distantes. |
| S-03 | `src/types/index.ts` et `supabase/migrations/001_initial_schema.sql` | Absence de champs structurés de classification. | La base distante peut avoir évolué ; seul le payload rendu est vérifié. |
| S-04 | `tests/support/mock-supabase.mjs` | Huit fixtures Farines génériques, zéro type, mock en lecture seule. | Données de test T16, pas catalogue métier. |
| S-05 | [Page publique Farines](https://moulin-de-balme.vercel.app/produits?categorie=farines), HTML SSR et payload RSC récupérés en lecture seule | 19 noms/slugs, descriptions, types explicites, `variations: []` pour `T90 & T130`. Empreinte du fichier observé : `722913c23e434c499d19181dd41019af97deaa5de40660e46d275998635fb6ff`. | Instantané public ; peut changer après consultation. Aucun accès direct à Supabase. |
| S-06 | [Arrêté du 13 juillet 1963 — homologation des types de farine de blé](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000000272197/) | Source primaire historique des types de blé. | Version initiale numérisée ; statut/applicabilité finale à confirmer par Théo. |
| S-07 | [FranceAgriMer — Enquête sur les types de farines, p. 3 (2012)](https://www.franceagrimer.fr/sites/default/files/rdd/documents/ETU-CER-farine%202010_2.pdf) | Définition institutionnelle, plages blé, matière sèche, lien cendres/minéraux/enveloppe. | Source institutionnelle, pas conseil culinaire individuel. |
| S-08 | [AFNOR — NF EN ISO 2171, norme en vigueur, mars 2023](https://www.boutique.afnor.org/fr-fr/norme/nf-en-iso-2171/cereales-legumineuses-et-produits-derives-determination-du-taux-de-cendres-/fa195241/343572) | Détermination du taux de cendres par incinération ; norme déclarée en vigueur. | Résumé public seulement ; aucun protocole détaillé recopié. |
| S-09 | [Ministère de l'Agriculture — cahier des charges Label Rouge LA 05/14 « Farine de meule », p. 2, homologué le 23 janvier 2025](https://info.agriculture.gouv.fr/boagri/document_administratif-2d4af2a0-4aa8-4ae2-9182-a99510800702/telechargement) | Plages, appellations et repères d'usage T45 à T150. | Les usages sont traités ici comme recommandations éditoriales, pas faits réglementaires universels. |
| S-10 | [Légifrance — décret n° 63-720 du 13 juillet 1963](https://www.legifrance.gouv.fr/loda/id/LEGITEXT000020132002/) | Légifrance indique le texte abrogé depuis le 1er juillet 2016. | Ne pas le présenter comme droit en vigueur. |
| S-11 | [Arrêté du 24 décembre 1963 — homologation des types de farine de seigle et de méteil](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000000478040/) | Existence et intitulé de la source primaire seigle/méteil. | Page/PDF primaire refusés en HTTP 403 pendant l'audit ; aucune plage de seigle n'est donc autorisée dans la copie. |
| S-12 | [Éduscol — sujet MC Boulangerie spécialisée, session 2018, p. 3](https://bnseep.eduscol.education.fr/ressources/examens/sujets/18/010/2210700/E2/U2_SUJET.pdf) | Source institutionnelle pédagogique distinguant les types de seigle, utile pour détecter l'anomalie T90. | Ce n'est pas le texte juridique primaire ; ne suffit pas à publier une plage. |

### Actions reproductibles réalisées

- `gh issue view 22 --repo OrionStudioSAS/Moulin-de-balme --comments ...` : lecture
  de l'issue, sans mutation ;
- lecture locale du mock, des types, de la migration et du rendu T16 ;
- récupération HTTP GET de la page publique Farines, extraction des noms/slugs et
  contrôle du payload rendu ;
- consultation des sources Légifrance, FranceAgriMer, AFNOR, ministère de
  l'Agriculture et Éduscol ;
- deux tentatives GET de la source Légifrance seigle ont renvoyé HTTP 403 ; le
  blocage est conservé au lieu d'utiliser un site marchand comme preuve.

## 12. Handoff humain

- **Julien :** statuer sur D-J01 à D-J03 et la partie éditoriale de D-JT01/D-JT02.
- **Théo :** statuer sur D-T01 à D-T04 et la partie technique/réglementaire de
  D-JT01/D-JT02 ; faire corriger la donnée T90/T130 hors de cette mission si
  nécessaire.
- **Léonie :** traduire la section 5 en composant cohérent avec la piste A de T16,
  sans changer la copie ni ajouter de contenu Figma non vérifié.
- **Gabriel :** implémenter seulement après validations, avec une source explicite
  et maintenable ; ne jamais parser le nom d'un produit pour en déduire le type.
- **Baptiste :** vérifier texte exact, liens, ordre DOM, clavier, absence de scroll
  horizontal et isolation Farines aux trois viewports.
- **Pauline :** fin de mission au présent contrat ; aucune publication, délégation,
  mutation distante, PR, fusion ou déploiement n'est autorisé.
