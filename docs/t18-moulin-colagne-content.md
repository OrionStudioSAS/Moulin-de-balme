# T18-PAULINE — Contrat de contenu et de preuves « Moulin de Colagne »

> **STATUT : CONDITIONNEL — VALIDATION DE JULIEN REQUISE AVANT PUBLICATION**
> Mission `T18-PAULINE`, qualifiée le 12 août 2026 sur la branche
> `feature/t18-moulin-colagne-section`, à partir du commit `5a5ab27`. Ce contrat
> rend la préparation Léonie/Gabriel possible, mais ne vaut ni validation
> éditoriale, ni autorisation d'utiliser la photographie, ni autorisation de
> publication.

## 1. Résumé de la mission

- Le nœud Figma exact `235:5255` contient un titre, un sous-titre historique,
  un paragraphe commercial, un CTA et un visuel appliqué avec deux remplissages
  image.
- Le fait historique publiable le plus solide est plus étroit que « 8 siècles
  d'histoire » : l'Inventaire général de la Région Occitanie documente un moulin
  royal au XIIIe siècle, sa destruction pendant les guerres de Religion, puis
  sa reconstruction aux XVIIe ou XVIIIe siècles.
- Les mentions de santé sont supprimées. Les formulations « méthodes
  traditionnelles » exclusives, transmission générationnelle, « plus d'un
  siècle », « authentique », « naturel » et « d'exception » restent des discours
  de marque ou des affirmations insuffisamment démontrées ; elles ne figurent pas
  dans la copie candidate.
- Aucun itinéraire interne réel du dépôt ne fournit de contenu complémentaire
  sur le Moulin de Colagne. Le CTA doit donc être **omis**, et non rendu désactivé
  ou relié à une URL externe inventée.
- Le visuel du Figma peut seulement être traité comme un asset fourni par le
  design. Le fichier source, son propriétaire, l'identité de la personne
  représentée, son consentement et le droit de publication restent à confirmer
  explicitement par Julien.

## 2. Périmètre et autonomie

### Inclus

- lecture en place du nœud Figma exact et qualification de sa copie ;
- recherche de sources officielles ou primaires ;
- inspection en lecture seule du dépôt et de la page publique Farines ;
- copie candidate exacte, décision CTA, consignes image/texte alternatif,
  risques, no-go, décisions manquantes et handoff.

### Exclu

- toute modification de l'application, de Figma, de Supabase, des dépendances,
  des données distantes, de la PR #21 ou de l'implémentation T17 ;
- toute certification historique, sanitaire, nutritionnelle ou réglementaire ;
- toute création de route, d'ancre, d'URL externe, d'asset ou de contenu produit ;
- toute validation de propriété intellectuelle ou de droit à l'image.

### Matrice d'autonomie

| Action | Niveau | Responsable proposé | Validation / limite |
| --- | --- | --- | --- |
| Utiliser ce contrat pour préparer la direction responsive | Vert | Léonie, à confirmer | Ne pas modifier la copie ni introduire une nouvelle promesse. |
| Préparer l'implémentation locale après accord éditorial | Vert | Gabriel, à confirmer | Reprendre les chaînes exactes et `cta = null`. |
| Valider la copie, la relation commerciale et le rôle du média | Orange | Julien | Validation explicite et traçable requise. |
| Valider l'asset, l'accessibilité, la performance et la PR future | Orange | Théo | Revue technique explicite requise. |
| Publier, merger, déployer ou modifier une donnée distante | Rouge | Humains uniquement | Toujours interdit à Pauline. |

## 3. Lecture exacte du Figma

Source : nœud [`235:5255`](https://www.figma.com/design/LDtjvMJrN0kLFdvnjePwyS/0405---Moulin-de-Balme--copie-?node-id=235-5255), lu le 12 août 2026 sans modification.

- Frame racine `235:5255`, nommé `docu` : environ `1441 × 714 px`.
- Section intérieure `235:5256` : environ `1404 × 678 px`.
- Quatre calques texte :
  - `Moulin de Colagne` ;
  - `Un Voyage à Travers les 8 Siècles d’histoire du Moulin` ;
  - le paragraphe commercial audité en section 5 ;
  - `EN SAVOIR PLUS SUR LE MOULIN DE COLAGNE`.
- Le frame photo `235:5257`, nommé
  `Capture d’écran 2022-05-04 à 17.11.25`, porte deux remplissages image visibles,
  de hashes Figma `17711233…86501fdb0ba5` et `cef7ad79…fac749890cf3`.
- Le rendu montre une personne devant des équipements de mouture. Le nom du
  calque et les hashes prouvent seulement la présence d'assets dans le fichier
  de design ; ils ne prouvent ni l'auteur, ni la propriété, ni une licence, ni
  l'identité de la personne.

## 4. Copie candidate exacte

> **COPIE SÛRE POUR REVUE, NON ENCORE APPROUVÉE POUR PUBLICATION.**
> Après validation de Julien, Gabriel doit reprendre ces chaînes sans les
> enrichir. Aucun autre sous-titre, label ou CTA n'est autorisé par ce contrat.

| Champ | Valeur exacte |
| --- | --- |
| Titre | `Moulin de Colagne` |
| Sous-titre | `Des traces documentaires dès le XIIIe siècle` |
| Corps | `À Chirac, en Lozère, l’Inventaire général du patrimoine culturel documente un moulin royal dès le XIIIe siècle. Détruit pendant les guerres de Religion, il a été reconstruit aux XVIIe ou XVIIIe siècles, puis transformé en minoterie au XIXe siècle. Le Moulin de Colagne indique exploiter aujourd’hui onze meules et quatre systèmes SODER, aux côtés d’équipements contemporains de suivi de production.` |
| CTA | `null` — ne rendre aucun lien, bouton ou emplacement réservé |

Cette copie décrit le moulin sans affirmer que toutes les farines visibles sur la
page proviennent de lui. Le dépôt et le HTML public observé ne contiennent aucun
champ fournisseur, aucune mention « Colagne » et aucun mapping produit → moulin.
Toute formulation telle que « notre partenaire », « nos farines du Moulin de
Colagne » ou « l'origine de nos farines » attend une preuve métier et l'accord de
Julien.

## 5. Audit des affirmations du Figma

| Affirmation | Qualification | Preuve et analyse | Décision de copie |
| --- | --- | --- | --- |
| « 8 siècles d'histoire » | **Partiellement vérifiée, à reformuler** | Le site du moulin revendique une trace en 1261 (`S-04`). L'Inventaire général confirme un moulin royal connu au XIIIe siècle, mais aussi une destruction puis une reconstruction aux XVIIe ou XVIIIe siècles (`S-03`). Il ne démontre pas huit siècles de continuité du même bâtiment, de la même entreprise ou de la même famille. | Remplacer par « Des traces documentaires dès le XIIIe siècle » et mentionner la reconstruction. |
| « la qualité, la santé et le goût » | **Discours de marque ; santé non publiable ici** | « Qualité » et « goût » sont des appréciations commerciales non mesurées. « Santé » associe une catégorie de denrées à la santé sans allégation spécifique, produit concerné, condition d'emploi ou dossier fourni. Les communications commerciales relèvent du règlement (CE) n° 1924/2006 ; seules les allégations conformes ou autorisées peuvent être utilisées (`S-06`, `S-07`). | Supprimer entièrement. Ne pas remplacer par « sain », « bon pour la santé », « nutritif » ou un synonyme. |
| Utilisation exclusive de « méthodes traditionnelles » | **Non démontrée et contredite par la portée absolue** | Le site du moulin emploie lui-même ce vocabulaire de marque, mais décrit aussi des moteurs électriques et un suivi/contrôle en temps réel de la production (`S-05`). Le mot « uniquement » du Figma ne peut donc pas devenir un fait neutre. | Remplacer par les équipements vérifiables : onze meules, quatre SODER et des équipements contemporains de suivi. |
| Savoir-faire transmis « de génération en génération » | **Affirmation de marque, non vérifiée indépendamment** | Le site du moulin parle de transmission et de famille depuis 1917 (`S-04`). L'Inventaire général documente des propriétaires successifs et une reprise en 1931 par « Constant, gendre Monnier », mais n'établit ni la chaîne familiale complète ni la transmission du savoir-faire (`S-03`). | Omettre. Une publication future exige archives, personnes/générations identifiées et validation Julien. |
| Patrimoine transmis « depuis plus d'un siècle » | **Affirmation de marque, chronologie à clarifier** | Le site du moulin donne 1917 (`S-04`) ; l'Inventaire général mentionne une vente vers 1908, l'installation de Monnier en 1915 et une reprise en 1931 (`S-03`). Ces jalons ne suffisent pas à prouver la transmission continue du « patrimoine culinaire » formulée dans le Figma. | Omettre. Ne pas convertir un anniversaire d'entreprise ou de famille en preuve d'un patrimoine produit transmis sans interruption. |
| Farines « authentiques », « naturelles » ou « d'exception » | **Promesses qualitatives / discours de marque** | Les sources du moulin utilisent ce vocabulaire promotionnel (`S-04`, `S-05`) mais aucun critère, protocole comparatif, composition ou certification n'est fourni pour ces qualificatifs dans le projet. « Naturel » peut en outre suggérer une propriété de composition ou de procédé non démontrée. | Supprimer. Décrire uniquement le lieu, la chronologie documentée et les équipements. |

Le retrait ci-dessus n'affirme pas que le discours de marque est faux. Il signifie
qu'il ne doit pas être présenté par Moulin de Balme comme un fait objectif sans
preuve adaptée à la portée exacte de la phrase.

## 6. Décision CTA

### Inventaire interne

Le dépôt contient notamment `/produits`, `/la-maison`, `/la-semaine`,
`/recettes`, `/stephane-reinat` et `/click-and-collect`. Aucun fichier de route,
composant, lien ou contenu ne contient « Moulin de Colagne » ou « Colagne ».

- `/la-maison` raconte le Moulin de Balme et le 7 avenue Alsace-Lorraine ; ce
  n'est pas une page sur le Moulin de Colagne.
- `/produits?categorie=farines` est la page courante ; y renvoyer le CTA ne donne
  aucune information supplémentaire.
- Les autres routes ne répondent pas au libellé « En savoir plus sur le Moulin de
  Colagne ».

### Contrat

**Décision : omettre entièrement le CTA.** Ne pas rendre un bouton désactivé, un
`href="#"`, un lien vers la page courante, un lien vers `/la-maison` ou une URL
externe. Un CTA pourra être requalifié seulement lorsqu'une destination interne
réelle contenant l'information annoncée sera disponible et validée par Julien.

## 7. Image, droits et texte alternatif

### Asset

- Le seul usage envisageable est l'asset source fourni dans le Figma, téléchargé
  après validation et versionné localement par Gabriel ; ne pas utiliser le rendu
  screenshot, une URL Figma temporaire, une reproduction générée ou une photo
  « équivalente » choisie sans validation.
- Les deux remplissages du frame `235:5257` doivent être exportés/inspectés comme
  sources distinctes. Léonie confirme le bon asset et le recadrage visible ;
  Gabriel ne déduit pas le fichier final à partir du seul hash ou du nom de calque.
- **Blocage humain :** Julien confirme par écrit le propriétaire/auteur, la
  licence ou cession, le droit de publication pour Moulin de Balme, le droit à
  l'image de la personne représentée et le périmètre web concerné. La présence du
  fichier dans Figma n'est pas une autorisation de publication.

### Rôle et alternative

- Rôle recommandé : **éditorial**, car la photographie apporte un contexte de
  personne et d'équipements que le texte seul ne donne pas.
- Texte alternatif sûr tant que l'identité n'est pas validée :
  `Une personne devant des équipements de mouture.`
- Ne pas employer le nom de calque comme alternative. Ne pas nommer la personne,
  le lieu précis, les machines ou leur propriétaire sans confirmation de Julien.
- Si Julien et Léonie décident que l'image est purement décorative, utiliser
  `alt=""` et ne pas dupliquer sa description dans un nom accessible.

## 8. Sources et journal de preuves

Toutes les sources web ont été consultées le **12 août 2026**.

| ID | Source | Nature / portée | Résultat retenu |
| --- | --- | --- | --- |
| `S-01` | [Issue #24 — T18](https://github.com/OrionStudioSAS/Moulin-de-balme/issues/24) | Brief client/projet autorisé | Périmètre, affirmations à auditer, CTA conditionnel, média et validations humaines. |
| `S-02` | [Figma — nœud exact `235:5255`](https://www.figma.com/design/LDtjvMJrN0kLFdvnjePwyS/0405---Moulin-de-Balme--copie-?node-id=235-5255) | Source de design, pas preuve des affirmations | Quatre textes exacts, dimensions, deux remplissages image et rendu photographique. |
| `S-03` | [Inventaire général du patrimoine culturel — dossier IA48000022, Région Occitanie](https://inventaire.patrimoines.laregion.fr/dossier/IA48000022) | Source patrimoniale officielle ; enquête 1993, mise à jour 2024 | Moulin royal connu au XIIIe siècle ; destruction, reconstruction, transformations et propriétaires documentés. |
| `S-04` | [Moulin de Colagne — « Une histoire »](https://moulindecolagne.fr/notre-histoire/une-histoire/) | Source primaire de la marque ; utile pour ses propres déclarations, non indépendante | Revendications 1261, 1917, transmission, modernisation de 2018 et vocabulaire commercial. |
| `S-05` | [Moulin de Colagne — « Le moulin »](https://moulindecolagne.fr/nos-installations/le-moulin/) | Source primaire de la marque sur ses installations actuelles | Chirac/Lozère, moteurs électriques, suivi temps réel, onze meules et quatre SODER. |
| `S-06` | [DGCCRF — Allégations nutritionnelles et de santé](https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/allegations-nutritionnelles-et-de-sante-ne-vous-faites-pas-avoir) | Autorité française compétente | Une allégation de santé suggère un lien aliment-santé ; principe des listes positives et champ des communications commerciales. |
| `S-07` | [Règlement (CE) n° 1924/2006 — EUR-Lex](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32006R1924) | Texte réglementaire officiel | Cadre applicable aux allégations nutritionnelles et de santé dans la présentation et la publicité des denrées. |
| `S-08` | Dépôt local, commit `5a5ab27` : `src/app/(public)/**`, `src/components/**` | Preuve projet interne | Routes réelles ; aucune destination ou mention interne dédiée au Moulin de Colagne. |
| `S-09` | [Page publique Farines](https://moulin-de-balme.vercel.app/produits?categorie=farines), HTML rendu | Preuve client publique à date | Dix-neuf produits observés ; aucune chaîne « Colagne » ou « Minoterie » et aucun mapping fournisseur visible. |
| `S-10` | Mandat Pauline v0.3, instruction système et constitution Orion Studio, lus dans `orion-agent-os` | Gouvernance interne | Séparation fait/hypothèse/inconnu, niveaux d'autonomie, absence de publication/délégation/merge/déploiement. |

## 9. Hypothèses, décisions manquantes et risques

### Hypothèses non converties en faits

- L'intention produit de l'issue suggère un lien entre la section et les farines
  proposées ; elle ne prouve pas que chaque produit de la catégorie vient du
  Moulin de Colagne.
- La photographie semble montrer le moulin ou son équipe ; le Figma seul ne
  permet pas de l'affirmer ni d'identifier la personne.
- Les deux hashes image peuvent représenter deux variantes ou deux couches d'un
  même visuel ; Gabriel doit inspecter les fichiers sources, pas deviner.

### Décisions requises

| ID | Décision / preuve manquante | Autorité | Effet tant qu'elle manque |
| --- | --- | --- | --- |
| `D-01` | Approbation mot pour mot du titre, sous-titre et corps | Julien | Copie non publiable. |
| `D-02` | Confirmation de la relation commerciale et des produits réellement concernés | Julien | Interdit d'écrire « partenaire », « fournisseur », « origine » ou « nos farines ». |
| `D-03` | Auteur/propriétaire, licence/cession, droit web et droit à l'image | Julien | Photographie non publiable. |
| `D-04` | Asset exact, recadrage et rôle éditorial/décoratif | Julien + Léonie | Gabriel ne versionne aucun fichier. |
| `D-05` | Acceptation de l'absence de CTA, ou création future d'une vraie destination interne | Julien | `cta = null`; aucun lien rendu. |
| `D-06` | Placement relatif à T16/T17 et comportement responsive | Léonie | Composition non spécifiée par Pauline. |
| `D-07` | Architecture d'asset, performance, accessibilité et tests | Théo | Aucune PR future prête à valider. |

### Risques et réduction

- **Risque historique :** « dès le XIIIe siècle » peut être lu comme continuité.
  La copie mentionne explicitement destruction et reconstruction.
- **Risque d'endossement :** reprendre le discours du site du moulin sans
  attribution le transforme en fait du Moulin de Balme. Les équipements actuels
  sont donc introduits par « indique exploiter ».
- **Risque sanitaire :** un synonyme doux de « santé » resterait une suggestion
  commerciale. Aucun bénéfice nutritionnel ou santé ne doit être ajouté.
- **Risque fournisseur :** la position de la section peut faire croire que tout le
  catalogue Farines a la même origine. Julien doit confirmer le lien métier ;
  Léonie évite une légende ou un surtitre qui l'affirmerait implicitement.
- **Risque média :** Figma donne accès au fichier, pas aux droits. Aucun export ne
  passe en production avant `D-03` et `D-04`.

## 10. No-go de mise en œuvre

- Ne pas réintroduire « 8 siècles » sans la nuance de rupture/reconstruction.
- Ne publier aucune mention de santé, nutrition, digestibilité, bienfait ou
  préservation de qualités nutritives.
- Ne pas écrire « uniquement/exclusivement des méthodes traditionnelles »,
  « ancestral », « de génération en génération » ou « depuis plus d'un siècle ».
- Ne pas qualifier les farines d'« authentiques », « naturelles »,
  « exceptionnelles », « supérieures » ou équivalent.
- Ne pas affirmer que le Moulin de Colagne fournit tout ou partie du catalogue
  tant que `D-02` n'est pas levée.
- Ne pas rendre de CTA de substitution, désactivé ou pointant vers `#`, la page
  courante, `/la-maison` ou un domaine externe.
- Ne pas nommer la personne photographiée ni attribuer la photo sans preuve.
- Ne pas utiliser une URL Figma temporaire, le screenshot du frame, une image
  générée ou un remplacement trouvé sur le web.
- Ne pas modifier l'application, Figma, Supabase, les dépendances, les données
  distantes, la PR #21 ou l'implémentation T17 dans le cadre Pauline.

## 11. Critères d'acceptation du contrat

- [x] Nœud Figma exact lu sans modification ; texte et image qualifiés.
- [x] Chaque affirmation listée par l'issue est classée fait, discours de marque
  ou formulation à supprimer/reformuler.
- [x] La copie candidate ne contient aucune allégation de santé ni superlatif.
- [x] La chronologie publiée ne suppose pas huit siècles de continuité.
- [x] Aucune relation fournisseur/produit n'est inventée.
- [x] Aucune destination CTA n'est inventée ; l'absence de CTA est explicite.
- [x] L'asset Figma est conditionné à une confirmation des droits par Julien.
- [x] L'alternative image couvre les rôles éditorial et décoratif.
- [x] Les sources, liens, nature des preuves et date d'accès sont consignés.
- [x] Aucun code applicatif, Figma, donnée, dépendance, PR, merge ou déploiement
  n'est modifié par Pauline.

## 12. Handoff humain

### Léonie

- Peut préparer la composition desktop/tablette/mobile à partir du rythme du
  nœud `235:5255`, des tokens Piste A et des chaînes exactes de la section 4.
- Doit maintenir `cta = null`, éviter toute légende qui affirme une origine
  produit, décider du rôle éditorial/décoratif du média et faire valider `D-04`.
- Doit fixer le placement relatif aux sections T16/T17 et signaler si la copie
  validée impose un écart de hauteur par rapport au Figma.

### Gabriel

- N'implémente qu'après validation explicite de `D-01`, `D-04` et de l'absence de
  CTA ; `D-02` est obligatoire avant toute mention de fournisseur/origine.
- Reprend mot pour mot la section 4, rend la section uniquement pour
  `categorie === "farines"` et ne crée aucun CTA lorsque la valeur est `null`.
- Après confirmation des droits, télécharge l'asset source exact du Figma,
  versionne le fichier localement et n'utilise aucune URL temporaire.
- Transmet ensuite à Théo l'architecture d'asset/accessibilité et à Baptiste les
  preuves responsive, contenu, alternative, non-régression et absence de lien.

### Validation finale

Julien reste l'autorité sur la copie, la relation commerciale, la photographie,
les droits et la décision CTA. Théo reste l'autorité sur l'implémentation
technique et la PR future. Merge et déploiement restent humains uniquement.
