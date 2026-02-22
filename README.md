# Kanban Demo (Fullstack Starter)

Stack:
- Frontend: Angular + NgRx
- Backend: Node.js + Express (vanilla JS)
- Data: PostgreSQL
- Realtime: WebSocket (`ws`)
- Local Dev: Docker Compose (Windows-friendly)

## Folder Layout

- `frontend/` Angular + NgRx app
- `backend/` Express REST API + WebSocket server
- `local-dev/` Docker Compose + Postgres init scripts

## Run with Docker (backend + postgres)

From `local-dev/`:

```bash
docker compose up --build
```

Then open:
- Backend health: http://localhost:3000/api/health
- REST board: http://localhost:3000/api/boards/1
- WebSocket: ws://localhost:3000/ws

## Run frontend locally on Windows

From `frontend/`:

```bash
npm install
npm start
```

Then open:
- Frontend: http://localhost:4200

## REST endpoints

- `GET /api/health`
- `GET /api/boards`
- `GET /api/boards/:boardId`
- `POST /api/boards/:boardId/cards`
- `PATCH /api/boards/:boardId/cards/:cardId/move`

## Realtime events

Backend broadcasts over WebSocket:
- `card.created`
- `card.moved`

The frontend subscribes and updates NgRx state on those events.
