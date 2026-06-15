# Roadmap Manager Todo API

API Todo construite avec Node.js, Express, PostgreSQL, Prisma, JWT, bcrypt, Docker, Nginx et GitHub Actions. Le projet sert de base d'apprentissage DevOps: developpement, tests, conteneurisation, CI/CD, deploiement et monitoring.

## Stack

- Backend: Node.js, Express
- Base de donnees: PostgreSQL
- ORM: Prisma
- Authentification: JWT
- Securite: bcrypt, Helmet, CORS configurable, rate limiting
- Validation: express-validator
- Logs: Morgan
- DevOps: Docker, Docker Compose, Nginx, GitHub Actions

## Demarrage Rapide

```bash
cp .env.example .env
docker compose up -d --build
docker compose ps
```

API directe:

```text
http://localhost:3000
```

API via Nginx:

```text
http://localhost
```

## Endpoints

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

## Tests Automatises

Tests unitaires et routes mockees:

```bash
npm install
npm run lint
npm test
```

Smoke test contre l'application Docker lancee:

```bash
docker compose up -d
npm run test:smoke
```

Le smoke test verifie:

- disponibilite de `/health` et `/ready`
- inscription de deux utilisateurs
- creation, liste, modification, completion et suppression d'une tache
- isolation des taches entre utilisateurs
- refus des requetes sans JWT

## Exemples Curl

Inscription:

```bash
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","name":"Ada","password":"strong-password"}'
```

Connexion:

```bash
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"strong-password"}'
```

Utilisation du token:

```bash
export TOKEN="colle_le_token_ici"
```

Creer une tache:

```bash
curl -X POST http://localhost/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Apprendre Docker","description":"Tester mon API"}'
```

Lister les taches:

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost/api/tasks
```

Marquer une tache terminee:

```bash
curl -X PATCH http://localhost/api/tasks/TASK_ID/complete \
  -H "Authorization: Bearer $TOKEN"
```

Supprimer une tache:

```bash
curl -X DELETE http://localhost/api/tasks/TASK_ID \
  -H "Authorization: Bearer $TOKEN"
```

## Commandes Docker Utiles

```bash
docker compose ps
docker compose logs -f app
docker compose logs -f nginx
docker compose down
docker compose down -v
```

## Cycle Git

```bash
git status
git add .
git commit -m "Describe your change"
git push
```

## Deploiement Ubuntu

```bash
sudo apt update
sudo apt install -y ca-certificates curl git
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo tee /etc/apt/keyrings/docker.asc > /dev/null
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Puis:

```bash
git clone https://github.com/KennyU13/roadmap-manager.git
cd roadmap-manager
cp .env.example .env
docker compose up -d --build
curl http://localhost/health
```
