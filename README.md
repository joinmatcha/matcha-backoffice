# Matcha Backoffice

Back-office administrateur de Matcha permettant la gestion :
- des utilisateurs
- des jobs
- des questionnaires
- des contenus administrables

Projet développé avec Next.js.

---

# Stack technique

- Next.js 16
- TypeScript
- Yarn Classic
- ESLint
- Prettier
- Jest
- Storybook

---

## Prerequis

- Node.js 22.16.0
- Yarn Classic 1.22.x


Vérification :

```bash
node -v
yarn -v
```

## Installation

```bash
yarn install
```
## Variables d'environnement

Créer un fichier .env à la racine :
NEXT_PUBLIC_API_URL=http://localhost:3000



## Lancement du projet

First, run the development server:

```bash
yarn dev
```
Application disponible sur : http://localhost:3001


## Scripts

| Script                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `yarn dev`             | Démarre application                                |
| `yarn lint`            | Vérifie ESLint                           |
| `yarn lint:fix`        | Corrige automatiquement ESLint           |
| `yarn format`          | Formate le projet avec Prettier          |
| `yarn test`            | Exécute les tests Jest                   |
| `yarn test:coverage`   | Exécute les tests avec couverture        |
| `yarn typecheck`       | Vérifie TypeScript sans émettre de build |
| `yarn storybook`       | Lance Storybook                          |
| `yarn build-storybook` | Génère le build statique Storybook       |

## API

Le back-office communique avec le projet matcha-api.

Documentation Swagger disponible sur :

http://localhost:3000/api-docs

## CI/CD

Le projet utilise GitHub Actions pour :

le lint
le build
les vérifications automatiques sur Pull Request

Configuration :

.github/workflows/ci.yml