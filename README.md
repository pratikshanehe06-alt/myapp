# MyApp API

## Start

```sh
docker compose up -d
psql "$DATABASE_URL" -f backend/schema.sql
```

Node-RED runs at `http://localhost:1880` and the React client at `http://localhost:5173`.

## Routes

All task routes require `Authorization: Bearer <accessToken>`.

| Method | Route | Body/query | Result |
| --- | --- | --- | --- |
| POST | `/auth/signup` | `{ "email": "...", "password": "..." }` | Creates a user and returns JWTs |
| POST | `/auth/login` | `{ "email": "...", "password": "..." }` | Returns JWTs |
| POST | `/auth/refresh` | `{ "refreshToken": "..." }` | Returns a new access token |
| GET | `/tasks` | `page`, `limit` query params | User-owned paginated tasks |
| POST | `/tasks` | `{ "title": "...", "description": "..." }` | Creates an owned task |
| GET | `/tasks/:id` | none | Gets one owned task |
| PUT | `/tasks/:id` | `{ "title", "description", "completed" }` | Updates one owned task |
| DELETE | `/tasks/:id` | none | Deletes one owned task |
| WS | `/ws?token=<accessToken>` | websocket events | User-scoped task events |

Task writes emit `task:created`, `task:updated`, or `task:deleted` events to that user’s connected clients.