# API

Le back-office communique avec le projet `matcha-api`.

---

## Base URL

```txt
http://localhost:3000
```

---

## Documentation Swagger

Disponible sur :

```txt
http://localhost:3000/api-docs
```

---

## Authentification

Les routes protégées utilisent un token JWT.

Header utilisé :

```txt
Authorization: Bearer <token>
```

Le token est récupéré depuis le localStorage.

---

## Routes principales utilisées

### Authentification

```txt
POST /api/admin/auth/login
```

### Utilisateurs

```txt
GET /api/admin/users
POST /api/admin/users
PUT /api/admin/users/:id
DELETE /api/admin/users/:id
```

---

## Réponses API

Les réponses sont au format JSON.