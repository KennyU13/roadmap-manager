# Roadmap Manager Todo API

Roadmap Manager Todo API est une API REST complete de gestion de taches concue pour demontrer un cycle DevOps moderne de bout en bout. Le projet ne se limite pas a un CRUD: il montre comment structurer, securiser, tester, conteneuriser et preparer au deploiement une application backend Node.js connectee a PostgreSQL.

## Pourquoi Ce Projet Est Important

Ce projet sert de base pratique pour comprendre les competences attendues dans un environnement backend et DevOps professionnel:

- construire une API maintenable avec separation routes, controllers, services et middleware
- proteger les endpoints avec JWT, bcrypt, validation d'entrees et isolation par utilisateur
- persister les donnees avec PostgreSQL et Prisma
- livrer l'application avec Docker et Docker Compose
- exposer l'API derriere Nginx comme reverse proxy
- automatiser la qualite avec lint, tests et workflow GitHub Actions
- verifier l'exploitation avec `/health`, `/ready`, logs HTTP et smoke tests

L'objectif est de relier le developpement applicatif aux pratiques de livraison logicielle: Developpement -> Git -> Tests -> Docker -> CI/CD -> Deploiement -> Monitoring.

## Fonctionnalites

- Inscription et connexion utilisateur
- Authentification JWT
- Hash des mots de passe avec bcrypt
- Creation, lecture, modification, suppression et completion des taches
- Isolation stricte: chaque utilisateur voit uniquement ses propres taches
- Validation des donnees entrantes
- Gestion centralisee des erreurs
- Endpoints de sante pour supervision

## Stack Technique

- Node.js et Express pour l'API REST
- PostgreSQL pour la base de donnees relationnelle
- Prisma pour le schema, les migrations et l'acces aux donnees
- JWT pour l'authentification stateless
- bcrypt pour la securisation des mots de passe
- Helmet, CORS et rate limiting pour la securite HTTP
- Morgan pour les logs applicatifs
- Docker, Docker Compose et Nginx pour l'execution proche production
- Jest, Supertest et smoke test pour la validation
- GitHub Actions pour la verification continue

## Architecture

```text
src/
├── config/
├── controllers/
├── middleware/
├── prisma/
├── routes/
├── services/
├── app.js
└── server.js
```

Cette organisation garde le code lisible et evolutif:

- `routes`: definition des endpoints HTTP
- `controllers`: gestion des requetes et reponses
- `services`: logique metier
- `middleware`: authentification, validation et erreurs
- `prisma`: schema et migrations de base de donnees

## Demarrage Rapide

```bash
cp .env.example .env
docker compose up -d --build
docker compose ps
```

API via Nginx:

```text
http://localhost
```

API directe:

```text
http://localhost:3000
```

## Verification

```bash
curl http://localhost/health
curl http://localhost/ready
```

Tests locaux:

```bash
npm install
npm run lint
npm test
```

Smoke test contre l'environnement Docker:

```bash
npm run test:smoke
```

Le smoke test valide le parcours complet: creation de deux utilisateurs, creation de tache, isolation entre utilisateurs, mise a jour, completion, suppression et refus des requetes non authentifiees.

## Endpoints Principaux

```text
GET    /
GET    /health
GET    /ready
POST   /api/auth/register
POST   /api/auth/login
GET    /api/tasks
POST   /api/tasks
PATCH  /api/tasks/:id
PATCH  /api/tasks/:id/complete
DELETE /api/tasks/:id
```

## Exemple D'utilisation

```bash
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","name":"Ada","password":"strong-password"}'
```

```bash
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"strong-password"}'
```

```bash
export TOKEN="colle_le_token_ici"

curl -X POST http://localhost/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Apprendre Docker","description":"Tester le cycle DevOps"}'
```

## Commandes D'exploitation

```bash
docker compose ps
docker compose logs -f app
docker compose logs -f nginx
docker compose down
docker compose down -v
```

## CI/CD

Le workflow GitHub Actions verifie automatiquement:

- installation des dependances
- generation du client Prisma
- lint
- tests
- build Docker

Cette verification reduit les regressions et confirme que le projet reste installable, testable et conteneurisable apres chaque modification.

## Deploiement

Le projet est pret pour un deploiement Linux avec Docker Compose. Une fois Docker installe sur le serveur:

```bash
git clone https://github.com/KennyU13/roadmap-manager.git
cd roadmap-manager
cp .env.example .env
docker compose up -d --build
curl http://localhost/health
```

En production, il faut remplacer les valeurs sensibles dans `.env`, utiliser un `JWT_SECRET` fort, configurer `CORS_ORIGIN` avec le domaine officiel et activer HTTPS dans Nginx.

## Statut Du Projet

Le projet dispose d'une base backend solide et exploitable. Les prochaines evolutions pertinentes seraient:

- documentation OpenAPI/Swagger
- refresh tokens
- pagination et filtres sur les taches
- tests d'integration avec base PostgreSQL dediee
- pipeline de publication d'image Docker
- monitoring avance avec Prometheus et Grafana
