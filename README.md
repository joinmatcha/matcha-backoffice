# Matcha Backoffice

Back-office Next.js pour administrer Matcha : utilisateurs, référentiel ROME,
tests de personnalité, bilan de compétences et statistiques.

## Stack technique

- **Framework** : Next.js 16 avec App Router
- **Langage** : React 19, TypeScript
- **Styling** : Tailwind CSS 4 + shadcn/ui
- **Tests** : Vitest + React Testing Library
- **Package manager** : Yarn 1
- **Node** : `24.15.0` (voir `.nvmrc`)

## Installation

```bash
nvm install
nvm use
yarn install
cp .env.example .env.local
```

L'API Matcha doit tourner à côté. En local, elle est généralement exposée sur
`http://localhost:5000`.

## Variables d'environnement

| Variable                   | Description                          | Valeur locale |
| -------------------------- | ------------------------------------ | ------------- |
| `BACKOFFICE_PORT`          | Port du serveur Next.js              | `3000`        |
| `NEXT_PUBLIC_API_PROTOCOL` | Protocole pour appeler l'API         | `http`        |
| `NEXT_PUBLIC_API_HOST`     | Hôte de l'API                        | `localhost`   |
| `NEXT_PUBLIC_API_PORT`     | Port de l'API                        | `5000`        |

`BACKOFFICE_PORT` définit le port du serveur Next.js en local uniquement — en
production, Vercel gère le port automatiquement et cette variable est inutile.

Les variables `NEXT_PUBLIC_API_*` construisent l'URL de l'API appelée côté
serveur (routes proxy) et côté client.

Si le BO tourne sur `http://localhost:3000`, l'API doit autoriser cette origine
côté CORS :

```bash
BACKOFFICE_URL=http://localhost:3000
```

## Développement

```bash
yarn dev
```

Le BO démarre sur le port défini par `BACKOFFICE_PORT` :

```text
http://localhost:3000
```

Compte admin local (créé via `yarn admin:promote` côté API) :

```text
admin@matcha.local
ChangeMe123!
```

## Scripts

| Script               | Description                          |
| -------------------- | ------------------------------------ |
| `yarn dev`           | Démarre le serveur en mode watch     |
| `yarn build`         | Build Next.js de production          |
| `yarn lint`          | ESLint                               |
| `yarn typecheck`     | TypeScript sans émission             |
| `yarn test`          | Tests unitaires et composants        |
| `yarn test:watch`    | Tests en mode watch                  |
| `yarn test:coverage` | Tests avec rapport de couverture     |
| `yarn ci`            | Lint + typecheck + tests + build     |

## Tests

Les tests sont écrits avec Vitest et React Testing Library.

```bash
yarn test
yarn test:coverage
```

Conventions :

- Placer les tests proches du code testé avec le suffixe `.test.ts` ou `.test.tsx`.
- Tester la logique d'API via `fetch` mocké.
- Tester les composants via le rendu utilisateur, pas les détails internes.
- Ajouter un test dès qu'une page ou un composant porte une logique métier,
  une mutation API ou un état d'erreur.

Tests présents :

| Fichier                                                      | Description                              |
| ------------------------------------------------------------ | ---------------------------------------- |
| `lib/api/admin.test.ts`                                      | Client API : URLs, méthodes, erreurs     |
| `components/auth/login-form.test.tsx`                        | Formulaire de connexion                  |
| `components/admin/pagination-controls.test.tsx`              | Composant de pagination                  |
| `components/admin/status-badge.test.tsx`                     | Badge de statut                          |
| `components/admin/users/user-form.test.tsx`                  | Formulaire utilisateur                   |
| `components/admin/personality/personality-mappers.test.ts`   | Mappers des tests de personnalité        |
| `components/admin/bilan/bilan-forms.test.tsx`                | Formulaires bilan de compétences         |

## CI/CD

La CI est définie dans `.github/workflows/ci.yml` et s'exécute sur chaque push
et pull request vers `main` et `develop1`.

### Pipeline

1. **Lint** — `yarn lint`
2. **Typecheck** — `yarn typecheck`
3. **Tests** — `yarn test:coverage`
4. **Build** — `yarn build` (dépend des 3 étapes précédentes)
5. **Coverage** — publie le résumé en commentaire PR, artifact `backoffice-coverage`

### Déploiement automatique

Chaque push sur `develop1` déclenche un déploiement sur Vercel en production.
Les autres branches créent des preview deployments avec une URL unique
(`*-matcha-project.vercel.app`).

## Déploiement sur Vercel

- **URL** : https://matcha-backoffice.vercel.app
- **Repo** : `joinmatcha/matcha-backoffice`, branche `develop1`
- **Plan** : Hobby
- **Production Branch** : `develop1`

### Variables d'environnement Vercel

| Variable                   | Valeur                                 |
| -------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_API_PROTOCOL` | `https`                                |
| `NEXT_PUBLIC_API_HOST`     | `matcha-api-4eme.onrender.com`         |
| `NEXT_PUBLIC_API_PORT`     | `443`                                  |

`BACKOFFICE_PORT` n'est pas défini sur Vercel (inutile en production).

### Côté API (Render)

La variable `BACKOFFICE_URL` doit être configurée sur Render pour autoriser le
CORS avec credentials :

```
BACKOFFICE_URL=https://matcha-backoffice.vercel.app
```

## Authentification admin

Le BO utilise l'auth admin de l'API via cookie `httpOnly`.

### Flux de connexion

Comme le backoffice (`vercel.app`) et l'API (`onrender.com`) sont sur des
domaines différents, le cookie posé par l'API ne peut pas être lu par le
middleware Next.js. Une route proxy intermédiaire résout ce problème :

```
Navigateur → POST /api/auth/login (Next.js, vercel.app)
               → POST /api/admin/auth/login (API, onrender.com)
               ← JWT dans Set-Cookie
             ← cookie admin_token posé sur vercel.app
```

1. Le navigateur envoie les credentials à `/api/auth/login` (route Next.js locale)
2. Next.js proxifie vers l'API externe et récupère le JWT
3. Next.js pose le cookie `admin_token` sur son propre domaine `vercel.app`
4. Le middleware `proxy.ts` protège `/dashboard` en lisant ce cookie

### Flux de déconnexion

`POST /api/auth/logout` (route Next.js locale) supprime le cookie `admin_token`
côté `vercel.app`.

### Routes locales Next.js (auth)

| Route                  | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `POST /api/auth/login` | Proxy login → pose le cookie sur vercel.app      |
| `POST /api/auth/logout`| Supprime le cookie admin_token sur vercel.app    |

## Architecture du projet

```
app/
├── api/auth/          # Routes proxy login/logout (cookie cross-domain)
├── dashboard/         # Pages admin protégées
│   ├── bilan/         # Gestion du bilan de compétences
│   ├── jobs/          # Référentiel ROME
│   ├── personality/   # Tests de personnalité
│   ├── stats/         # Statistiques plateforme
│   ├── support/       # Demandes de support
│   ├── users/         # Gestion utilisateurs
│   └── work-style/    # Tests de style de travail
└── login/             # Page de connexion
components/
├── admin/             # Composants métier par domaine
├── auth/              # Formulaire de connexion
├── layout/            # Layout commun (sidebar, header)
└── ui/                # Composants shadcn/ui
lib/api/               # Client API et modules par domaine
proxy.ts               # Middleware Next.js (protection /dashboard)
```

## Accès aux services

| Service                      | URL                                           | Connexion                            |
| ---------------------------- | --------------------------------------------- | ------------------------------------ |
| **Vercel** (hébergement BO)  | https://vercel.com/matcha-project             | Google (`matcha.api.gpe@gmail.com`)  |
| **GitHub** (code source)     | https://github.com/joinmatcha                 | Compte personnel (org `joinmatcha`)  |
| **API Matcha**               | https://matcha-api-4eme.onrender.com/api-docs | —                                    |

## Référentiel ROME

La page `/dashboard/jobs` permet de :

- consulter le statut du référentiel ROME,
- lancer une synchronisation manuelle,
- suivre la progression,
- consulter l'historique des imports.

Routes API utilisées :

| Endpoint                        | Description                          |
| ------------------------------- | ------------------------------------ |
| `GET /api/admin/rome/status`    | Statut courant et dernière synchro   |
| `POST /api/admin/rome/sync`     | Lance une synchronisation manuelle   |
| `GET /api/admin/rome/sync-runs` | Historique paginé                    |
