# Épreuve Rattrapage — Suivi des tickets

Application de suivi des demandes de support : un ticket a un titre, une description,
un statut et une date de création. On peut en créer, les lister et les fermer.

- **Backend** : Spring Boot 3.5.3 (Java 17) + PostgreSQL 16 + springdoc/Swagger
- **Frontend** : Angular 20 (un seul écran : liste, filtre, formulaire, fermeture)

## 1. La base de données (Docker)

```bash
docker compose up -d
```

PostgreSQL écoute sur `localhost:5433`, base `tickets`, utilisateur `ticket_user`.

## 2. Le backend

```bash
cd backend
mvn spring-boot:run
```

- API : <http://localhost:8080/api/tickets>
- Swagger : <http://localhost:8080/swagger-ui/index.html>

## 3. Le frontend

```bash
cd frontend
npm install
npm start
```

- Écran : <http://localhost:4200>
- Le serveur de développement redirige `/api` vers le backend (`proxy.conf.json`).

## Les règles de gestion

| Réf. | Règle |
|------|-------|
| RG-01 | Le titre est obligatoire et ne dépasse pas 100 caractères. Un ticket est créé avec le statut OUVERT. |
| RG-02 | Deux tickets ne peuvent pas avoir le même titre. |
| RG-03 | Un ticket ne peut être fermé que s'il est OUVERT ou EN_COURS. Un ticket FERME ne change plus d'état. |

## Les endpoints

| Verbe | Chemin | Rôle | Succès | Erreurs |
|-------|--------|------|--------|---------|
| POST | `/api/tickets` | Créer un ticket | 201 | 400 (RG-01), 409 (RG-02) |
| GET | `/api/tickets?statut=OUVERT` | Lister, filtrable par statut | 200 | — |
| PATCH | `/api/tickets/{id}/fermer` | Fermer un ticket | 200 | 404, 409 (RG-03) |

Exemple de création :

```bash
curl -X POST http://localhost:8080/api/tickets \
  -H 'Content-Type: application/json' \
  -d '{"titre":"Imprimante hors service","description":"2e étage"}'
```

## Vérifier un ticket directement en base

```bash
docker exec -it ticket-postgres psql -U ticket_user -d tickets \
  -c "SELECT id, titre, statut, date_creation FROM ticket;"
```
