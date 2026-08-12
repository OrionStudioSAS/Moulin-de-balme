# Défauts et anomalies — T14

## Défauts confirmés

### T14-DEF-001 — CTA « Découvrir la boulangerie » vers une route inexistante

- **Sévérité :** majeur
- **Autonomie :** vert
- **Route :** `/` vers `/collections`
- **Viewport et état :** indépendant du viewport ; accueil HTML servi, état initial
- **Version/environnement :** preview publique le 2026-08-12 ; version Vercel immuable non fournie
- **Étapes de reproduction :** 1. Charger `/`. 2. Repérer le lien `Découvrir la boulangerie` dont le `href` vaut `/collections`. 3. Requêter cette destination.
- **Résultat attendu :** le CTA ouvre une page publique existante correspondant à la boulangerie.
- **Résultat observé :** `/collections` répond HTTP 404.
- **Fréquence :** 1/1 requête HTTP.
- **Impact :** navigation publique interrompue depuis un CTA éditorial.
- **Preuve :** HTML réellement servi le 2026-08-12 (`href="/collections"`) ; contrôle `curl -sS -L` → HTTP 404 ; source locale `src/components/home/HistoireSection.tsx`.
- **Spécialiste concerné :** Gabriel.
- **Validation humaine éventuelle :** Julien confirme la destination éditoriale exacte avant correction si elle n'est pas évidente ; Théo revoit la PR technique.

### T14-DEF-002 — CTA « Découvrir le boulanger » sans cible d'ancre

- **Sévérité :** mineur
- **Autonomie :** vert
- **Route :** `/` vers `/#stephane-reinat`
- **Viewport et état :** indépendant du viewport ; accueil HTML servi, état initial
- **Version/environnement :** preview publique le 2026-08-12 ; version Vercel immuable non fournie
- **Étapes de reproduction :** 1. Charger `/`. 2. Repérer le lien `Découvrir le boulanger` dont le `href` vaut `/#stephane-reinat`. 3. Rechercher `id="stephane-reinat"` dans le document servi.
- **Résultat attendu :** l'activation positionne la page sur une section portant cet identifiant, ou navigue vers la fiche publique du boulanger.
- **Résultat observé :** aucun élément `id="stephane-reinat"` n'est présent dans le HTML de l'accueil ; la cible ne peut donc pas être résolue comme ancre.
- **Fréquence :** 1/1 inspection du document servi.
- **Impact :** CTA sans destination utile vérifiable.
- **Preuve :** HTML réellement servi et contrôle d'absence ; source locale `src/components/home/HistoireSection.tsx`.
- **Spécialiste concerné :** Gabriel.
- **Validation humaine éventuelle :** Julien confirme si la destination attendue est `/stephane-reinat` ou une section de l'accueil ; Théo revoit la PR technique.

## Anomalies issues du code, non reproduites

### T14-OBS-001 — Champs de commande sans labels programmatiques

- **Sévérité proposée :** majeur
- **Autonomie :** orange
- **Route :** `/click-and-collect`
- **Viewport et état :** tous ; panier non vide, formulaire affiché
- **Étapes de reproduction prévues :** ajouter localement un produit, atteindre le formulaire au clavier et inspecter les noms accessibles.
- **Résultat attendu :** chaque champ possède un label persistant et un nom accessible explicite.
- **Résultat observé :** **non reproduit**. Le code montre cinq contrôles reposant sur des placeholders ou leur valeur, sans `<label>` ni `aria-label`.
- **Preuve :** analyse de `src/components/ClickCollectForm.tsx` uniquement ; état conditionnel non ouvert dans la preview.
- **Spécialiste concerné :** Gabriel, avec validation de Théo pour la stratégie accessibilité.
- **Validation humaine éventuelle :** Théo ; Julien si le libellé visible impose un choix de contenu.

### T14-OBS-002 — Overlays sans sémantique de dialogue ni gestion complète du focus

- **Sévérité proposée :** majeur
- **Autonomie :** orange
- **Route :** toutes les routes avec navigation
- **Viewport et état :** tous ; recherche ou panier ouvert
- **Étapes de reproduction prévues :** ouvrir l'overlay au clavier, parcourir Tab/Maj+Tab, fermer par Escape, vérifier le retour du focus.
- **Résultat attendu :** dialogue nommé, focus initial et captif approprié, fermeture clavier et restauration du focus.
- **Résultat observé :** **non reproduit**. Le code de `SearchOverlay` et `SideCart` n'expose pas `role="dialog"`/`aria-modal`; Escape n'est géré que depuis le champ de recherche et aucune restauration explicite du focus n'est visible.
- **Preuve :** analyse de `src/components/SearchOverlay.tsx` et `src/components/SideCart.tsx` uniquement.
- **Spécialiste concerné :** Gabriel.
- **Validation humaine éventuelle :** Théo pour le comportement technique ; Julien pour l'expérience si arbitrage.

### T14-OBS-003 — Liens sociaux et un CTA avec `href="#"`

- **Sévérité proposée :** mineur
- **Autonomie :** orange
- **Route :** pied de page public et `/stephane-reinat`
- **Viewport et état :** tous ; état initial
- **Étapes de reproduction prévues :** activer chaque lien et observer la destination/focus.
- **Résultat attendu :** chaque lien possède une destination réelle ou n'est pas exposé comme lien actif.
- **Résultat observé :** **non reproduit par interaction**. Le code contient des liens `href="#"` dans `Footer.tsx` et `stephane-reinat/page.tsx`.
- **Preuve :** analyse de source uniquement.
- **Spécialiste concerné :** Gabriel après fourniture des destinations.
- **Validation humaine éventuelle :** Julien doit fournir/valider les destinations ; défaut non transmissible en vert avant cette décision.

