# Matrice des routes — T14

Contrôle effectué par requête HTTP GET avec suivi des redirections. Il prouve la disponibilité HTTP et non le rendu ou l'interactivité navigateur.

| Route | Résultat | Statut |
| --- | --- | --- |
| `/` | 200 | HTTP vérifié |
| `/produits` | 200 | HTTP vérifié |
| `/produits/miche-polaris` | 200 | fiche réelle vérifiée |
| `/produits/croissant-pur-beurre` | 200 | fiche réelle vérifiée |
| `/produits/baguette-de-tradition-francaise` | 200 | fiche réelle vérifiée |
| `/la-maison` | 200 | HTTP vérifié |
| `/la-semaine` | 200 | HTTP vérifié |
| `/recettes` | 200 | HTTP vérifié |
| `/recettes/baguette-parisienne` | 200 | fiche réelle vérifiée |
| `/recettes/brioche-feuilletee` | 200 | fiche réelle vérifiée |
| `/recettes/canele-de-bordeaux` | 200 | fiche réelle vérifiée |
| `/stephane-reinat` | 200 | HTTP vérifié |
| `/click-and-collect` | 200 | HTTP vérifié ; formulaire non soumis |
| `/collections` | 404 | défaut confirmé depuis un CTA de `/` |

Slugs recettes supplémentaires découverts dans le HTML public mais non requêtés individuellement : `confiture-figues-miel`, `croissant-au-beurre`, `pain-de-seigle-au-levain`.

Navigation réellement cliquée : **non exécutée**, navigateur indisponible.

