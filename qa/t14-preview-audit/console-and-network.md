# Console et réseau — T14

## Console et JavaScript

**Non exécuté.** Aucun navigateur pilotable n'était disponible. Il n'a donc pas été possible de collecter de façon fiable :

- erreurs `console.error` ou avertissements ;
- exceptions `pageerror` ;
- erreurs d'hydratation ;
- échecs JavaScript lors des interactions.

## Réseau

Contrôles HTTP hors navigateur exécutés :

- accueil et 12 autres routes attendues/échantillonnées : HTTP 200 ;
- `/collections`, cible d'un CTA public : HTTP 404 ;
- temps observés lors du passage de matrice : environ 0,32 à 1,17 seconde par route, sans valeur de performance utilisateur.

Non exécuté : waterfall navigateur, requêtes XHR/fetch Supabase déclenchées par recherche, chargement réel de toutes les images, ressources bloquées/CORS, requêtes annulées et statuts des chunks lors de l'hydratation.

Aucune commande et aucun formulaire n'ont été soumis. Aucune écriture Supabase n'a été déclenchée.

