# CI / CD

Le projet utilise GitHub Actions pour automatiser les vérifications du projet.

---

## CI (Continuous Integration)

La pipeline CI exécute automatiquement :

- l’installation des dépendances
- ESLint
- la vérification TypeScript
- les tests
- le build du projet

La pipeline se lance :
- à chaque Pull Request
- à chaque push sur `main`
- à chaque push sur `develop1`

---

## Fichier de configuration

```txt
.github/workflows/ci.yml
```

---

## Commandes exécutées

```bash
yarn install --frozen-lockfile
yarn lint
yarn typecheck
yarn test
yarn build
```

---

## Objectif

La CI permet de :
- détecter les erreurs avant merge
- sécuriser les Pull Requests
- garantir que le projet compile correctement
- maintenir une qualité de code minimale