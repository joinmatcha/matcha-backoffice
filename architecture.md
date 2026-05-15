# Architecture

Le projet utilise Next.js avec App Router.

---

## Structure du projet

```txt
src/
 ├── app/
 ├── components/
 ├── hooks/
 ├── services/
 ├── types/
 └── utils/
```

---

## Dossiers principaux

### app/

Contient :
- les pages
- les layouts
- les routes Next.js

---

### components/

Composants réutilisables de l’interface utilisateur.

---

### hooks/

Hooks React personnalisés.

---

### services/

Gestion des appels API.

---

### types/

Types TypeScript partagés.

---

### utils/

Fonctions utilitaires réutilisables.

---

## Authentification

Le projet utilise une authentification JWT.

Le token est stocké dans le localStorage.

---

## API

Le front communique avec `matcha-api`.