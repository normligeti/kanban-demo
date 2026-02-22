require('dotenv').config();

const http = require('http');
const express = require('express');
const cors = require('cors');

const { pool, initDb } = require('./db');
const { createWsHub } = require('./wsHub');
const { createBoardsRouter } = require('./routes/boards');

const app = express();
const server = http.createServer(app);
const wsHub = createWsHub(server);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200'
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/boards', createBoardsRouter(pool, wsHub));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

async function start() {
  try {
    await initDb();

    const port = Number(process.env.PORT || 3000);
    server.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
