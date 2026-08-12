# Notifications Google Chat

Le workflow `.github/workflows/notify-google-chat-pr.yml` avertit le Space Google Chat **MOULIN DE BALME** lorsqu’une pull request non brouillon est ouverte, rouverte ou déclarée prête pour revue.

## Source de vérité

Google Chat sert uniquement de notification. La revue, les validations, les décisions et le merge restent dans GitHub.

## Secret requis

Le dépôt doit contenir le secret GitHub Actions `GOOGLE_CHAT_WEBHOOK`. Sa valeur est l’URL du webhook du Space. Elle ne doit jamais apparaître dans le dépôt, les logs ou une conversation.

## Actions humaines affichées

- Julien contrôle le produit, le contenu et le rendu visuel lorsqu’ils sont concernés.
- Théo contrôle l’architecture, la sécurité, les tests et autorise le merge.

Les responsabilités précises restent celles du ticket et de la pull request.
