# Authentification

Le back-office utilise une authentification JWT.

## Fonctionnement

1. L’utilisateur se connecte via `/login`
2. L’API retourne un token JWT
3. Le token est stocké dans le localStorage :

```txt
localStorage["token"]