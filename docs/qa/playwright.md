# Playwright — tests publics sûrs

## Exécution locale

```bash
npm install
npx playwright install chromium
npm run test:e2e:list
npm run test:e2e:chromium
```

Par défaut, Playwright démarre Next.js sur `http://127.0.0.1:3000` et un mock Supabase local en lecture seule sur `http://127.0.0.1:54321`. Il renvoie des collections vides, refuse toute méthode d'écriture et reçoit une clé factice : aucun accès ni aucune écriture distante n'est alors possible.

Pour tester une preview explicitement autorisée :

```bash
PLAYWRIGHT_BASE_URL=https://preview.example.invalid npm run test:e2e:chromium
```

Ne jamais cibler une URL de production pour un scénario qui ajoute un produit, remplit un formulaire ou confirme une commande. Les tests actuels n'envoient aucun formulaire et ne visitent pas l'administration. La recherche publique effectue seulement une lecture contre le mock local.

Les traces, vidéos, captures et rapports sont écrits sous `test-results/`, ignoré par Git. Ils peuvent contenir des URL et réponses : les vérifier avant partage.

## CI et dépendances

La CI n'est pas ajoutée par T12 : T01 doit d'abord définir de façon fiable le runtime, les variables factices/isolées et le démarrage de l'application. T03 et un environnement isolé restent obligatoires pour toute commande réelle. Une future CI devra installer les dépendances avec `npm ci`, installer uniquement Chromium avec `npx playwright install --with-deps chromium`, puis lancer `npm run test:e2e:chromium`.

## Handoff Gabriel pour T15

Quand T15 sera livré, remplacer les corps vides de `tests/e2e/cart-recommendations.t15.spec.ts` par des assertions réelles et retirer uniquement le `describe.skip` après vérification de la section. Utiliser un produit obtenu depuis l'interface publique ou une fixture locale déterministe, jamais une écriture Supabase. Vérifier séparément : section visible avec panier non vide, trois suggestions maximum, produit courant exclu, ajout d'une suggestion, total recalculé, tiroir toujours ouvert, parcours clavier complet et viewport mobile 390 × 844. Ne pas déclencher le lien Click & Collect et ne soumettre aucun formulaire.
