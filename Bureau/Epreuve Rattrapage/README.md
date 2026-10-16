# Épreuve Rattrapage — Suivi des tickets

Application de suivi des demandes de support : un ticket a un titre, une description,
un statut et une date de création. On peut en créer, les lister et les fermer.

- **Backend** : Spring Boot 3.5.3 (Java 17) + PostgreSQL 16 + springdoc/Swagger
- **Frontend** : Angular 20 (un seul écran : liste, filtre, formulaire, fermeture)

## Tout démarrer en une commande

```bash
./demarrer.sh
```

Le script démarre la base Docker, puis le backend et l'écran, attend que chacun
réponde et affiche les adresses. Il ne redémarre pas un service déjà lancé, donc
on peut le relancer sans risque. Journaux dans `logs/`.

Il tourne sous Linux comme sous macOS : s'il trouve `setsid` il s'en sert, sinon
il arrête lui-même toute la descendance des processus qu'il a lancés. Et si un
service refuse de démarrer, il affiche la fin de son journal et n'abandonne
pas derrière lui ceux qu'il avait déjà lancés.

| | |
|---|---|
| Écran | <http://localhost:4200> |
| API | <http://localhost:8080/api/tickets> |
| Swagger | <http://localhost:8080/swagger-ui.html> |
| Base | `localhost:5433` — `tickets` / `ticket_user` |

`Ctrl+C` arrête le backend et l'écran ; la base reste allumée.
Pour tout arrêter, y compris la base : `docker compose down`.

## Ou service par service

```bash
# 1. la base (PostgreSQL 16, port 5433)
docker compose up -d

# 2. le backend (port 8080)
cd backend && mvn spring-boot:run

# 3. l'écran (port 4200)
cd frontend && npm install && npm start
```

L'écran appelle directement l'API sur `http://localhost:8080` (le backend
autorise l'origine `http://localhost:4200`, voir `WebConfig`).

## Ce que fait l'écran

Un écran unique (<http://localhost:4200>) : compteur de tickets ouverts, formulaire de
création, puis la liste avec filtre par statut, badge de couleur par statut, tri par
date de création (en-tête cliquable) et pagination (5 par page). Le bouton *Fermer*
n'apparaît que sur un ticket OUVERT ou EN_COURS et demande confirmation.

Les quatre états sont gérés : chargement, données, liste vide (« Aucun ticket ») et
erreur avec un bouton *Réessayer*.

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
