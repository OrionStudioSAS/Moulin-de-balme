# Journal de preuves — T12

- Mission : GitHub #13, branche `test/t12-playwright`, agent Baptiste.
- Autorisation : commentaire propriétaire du 12 août 2026 autorisant Playwright, Chromium, desktop/mobile, parcours publics non destructifs, artefacts et préparation T15.
- Niveau : orange — ajout d'une dépendance et configuration ; revue Théo requise, aucun merge ni déploiement.
- Environnement local : Next.js 14, React 18, TypeScript, npm avec `package-lock.json` ; Node.js fourni par nvm.
- Lint : le script existant ouvrait l'assistant interactif faute de configuration ; `.eslintrc.json` explicite désormais le profil Next.js `core-web-vitals` sans changer de dépendance métier.
- Données : aucune fixture distante, aucune connexion admin, aucune soumission de formulaire, aucune commande. Valeurs Supabase locales factices lorsque les variables ne sont pas injectées.
- CI : non créée ; T01 reste le prérequis explicite à une CI fiable.
- T15 : non présent sur la branche ; scénarios préparatoires ignorés explicitement, aucun résultat fabriqué.
- Exécution Chromium locale finale : 30 cas découverts, 15 passés, 15 ignorés (14 cas T15 sur les deux projets et recherche mobile non exposée), 0 échec, en 15,6 s.
- Anomalie observée hors T12 : `/images/recettes-hero.jpg` est référencée mais absente, journalisée deux fois par Next.js pendant les visites desktop/mobile de `/recettes`.
- Lint : échec sur 3 erreurs préexistantes `react/no-unescaped-entities` dans `src/components/Footer.tsx` (ligne 99) et `src/components/admin/ProductForm.tsx` (lignes 174 et 257) ; non masquées et non corrigées hors périmètre.

Les commandes et résultats finaux sont consignés dans la pull request. Un test non exécuté ou en échec doit rester indiqué comme tel.
