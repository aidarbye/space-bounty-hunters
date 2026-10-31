# Space Bounty Hunters API

REST API for space bounty hunters on Node.js (Express) and PostgreSQL, running in Docker Compose.

## Run

```
cp .env.example .env
docker compose up --build
```

API: `http://localhost:3000`

## Database setup

The schema and seed data are in `db/init.sql`. PostgreSQL imports it automatically on the first start (6 criminals, 10 hunt logs).

To reimport from scratch:

```
docker compose down -v
docker compose up --build
```

## Models

- `criminals`: id, name (nullable), nickname, reward, last_latitude, last_longitude, last_known_note, difficulty (1 to 10), armed, has_crew, escape_master
- `hunt_logs`: id, criminal_id (FK to criminals), success, notes, created_at (set by the server)

One criminal has many hunt logs.

## Endpoints

| Method | Endpoint              | Description                 |
|--------|-----------------------|-----------------------------|
| GET    | /api/criminals/       | List criminals              |
| GET    | /api/criminals/{id}/  | Get criminal by ID          |
| GET    | /api/hunts/           | List hunt logs              |
| GET    | /api/hunts/{id}/      | Get hunt log by ID          |
| POST   | /api/hunts/           | Create hunt log             |
| PATCH  | /api/hunts/{id}/      | Update success or notes     |
| DELETE | /api/hunts/{id}/      | Delete hunt log             |

Criminal filters: `min_reward`, `max_reward`, `armed`, `has_crew`, `escape_master`, `sort=reward|-reward`.
Example: `/api/criminals/?min_reward=5000&armed=true&sort=-reward`

Hunt filter: `criminal_id`. Example: `/api/hunts/?criminal_id=5`

POST body:

```json
{
  "criminal_id": 3,
  "success": false,
  "notes": "Target escaped through an asteroid field."
}
```

## Postman

Import `postman/Space-Bounty-Hunters.postman_collection.json`.
