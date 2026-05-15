# Matcha Backoffice

Back-office Next.js pour administrer Matcha : utilisateurs, référentiel ROME,
tests de personnalité, bilan de compétences et statistiques.

## Stack technique

- Next.js 16 avec App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Vitest + React Testing Library
- Yarn 1
- Node `24.15.0` via `.nvmrc`

## Installation

```bash
nvm install
nvm use
yarn install
cp .env.example .env.local
```

L'API Matcha doit tourner à côté. En local, elle est généralement exposée sur
`http://localhost:3000`.

## Environnement

| Variable                   | Description                                | Valeur locale |
| -------------------------- | ------------------------------------------ | ------------- |
| `BACKOFFICE_PORT`          | Port du serveur Next                       | `3001`        |
| `NEXT_PUBLIC_API_PROTOCOL` | Protocole utilisé pour appeler l'API       | `http`        |
| `NEXT_PUBLIC_API_HOST`     | Hôte de l'API                              | `localhost`   |
| `NEXT_PUBLIC_API_PORT`     | Port de l'API                              | `3000`        |

`BACKOFFICE_PORT` définit le port du serveur Next en local. Les variables
`NEXT_PUBLIC_API_*` construisent l'URL de l'API appelée par le back-office.

Si le BO tourne sur `http://localhost:3001`, l'API doit autoriser cette origine
côté CORS avec :

```bash
BACKOFFICE_URL=http://localhost:3001
```

## Développement

```bash
yarn dev
```

Le BO démarre sur le port défini par `BACKOFFICE_PORT`, donc par défaut :

```text
http://localhost:3001
```

Compte admin local créé par l'API :

```text
admin@matcha.local
ChangeMe123!
```

## Scripts

```bash
yarn lint        # ESLint
yarn typecheck   # TypeScript sans émission
yarn test        # Tests unitaires/composants
yarn test:watch  # Tests en mode watch
yarn test:coverage
yarn build       # Build Next.js
yarn ci          # Lint + typecheck + tests + build
```

## Tests

Les tests sont écrits avec Vitest et React Testing Library.

Conventions :

- Placer les tests proches du code testé avec le suffixe `.test.ts` ou
  `.test.tsx`.
- Tester la logique d'API via `fetch` mocké.
- Tester les composants via le rendu utilisateur, pas les détails internes.
- Ajouter un test dès qu'une page ou un composant porte une logique métier,
  une mutation API ou un état d'erreur.

Tests présents :

- `lib/api/admin.test.ts`
- `components/auth/login-form.test.tsx`
- `components/admin/pagination-controls.test.tsx`
- `components/admin/status-badge.test.tsx`

## CI GitHub

La CI est définie dans `.github/workflows/ci.yml`.

Stages :

- `lint`
- `typecheck`
- `test` avec coverage
- `build`
- `coverage-summary`

Le build dépend de `lint`, `typecheck` et `test`.

Le job `coverage-summary` publie le résumé de couverture dans le résumé GitHub
Actions et ajoute un commentaire sur les pull requests. L'artifact
`backoffice-coverage` contient le rapport complet.

## Authentification admin

Le BO utilise l'auth admin de l'API via cookie `httpOnly`.

Flux :

1. `POST /api/admin/auth/login`
2. L'API pose le cookie admin.
3. Le proxy Next protège `/dashboard`.
4. `POST /api/admin/auth/logout` + `/api/auth/logout` nettoient la session.

Le cookie attendu côté BO est `admin_token`.

## Référentiel ROME

La page `/dashboard/jobs` permet de :

- consulter le statut du référentiel ROME,
- lancer une synchronisation,
- suivre la progression,
- consulter l'historique des imports.

Routes API utilisées :

- `GET /api/admin/rome/status`
- `POST /api/admin/rome/sync`
- `GET /api/admin/rome/sync-runs`
