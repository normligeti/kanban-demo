const express = require('express');

function createBoardsRouter(pool, wsHub) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const boards = await pool.query('SELECT id, name, created_at FROM boards ORDER BY id');
      res.json(boards.rows);
    } catch (err) {
      next(err);
    }
  });

  router.get('/:boardId', async (req, res, next) => {
    try {
      const boardId = Number(req.params.boardId);
      const boardResult = await pool.query('SELECT id, name FROM boards WHERE id = $1', [boardId]);

      if (boardResult.rowCount === 0) {
        return res.status(404).json({ message: 'Board not found' });
      }

      const columnsResult = await pool.query(
        'SELECT id, board_id, title, position FROM columns_tbl WHERE board_id = $1 ORDER BY position, id',
        [boardId]
      );

      const cardsResult = await pool.query(
        `
        SELECT c.id, c.column_id, c.title, c.description, c.position
        FROM cards c
        INNER JOIN columns_tbl col ON col.id = c.column_id
        WHERE col.board_id = $1
        ORDER BY c.position, c.id
      `,
        [boardId]
      );

      const cardsByColumn = cardsResult.rows.reduce((acc, card) => {
        if (!acc[card.column_id]) {
          acc[card.column_id] = [];
        }
        acc[card.column_id].push(card);
        return acc;
      }, {});

      const columns = columnsResult.rows.map((column) => ({
        ...column,
        cards: cardsByColumn[column.id] || []
      }));

      res.json({
        ...boardResult.rows[0],
        columns
      });
    } catch (err) {
      next(err);
    }
  });

  router.post('/:boardId/cards', async (req, res, next) => {
    try {
      const boardId = Number(req.params.boardId);
      const { columnId, title, description } = req.body;

      if (!columnId || !title) {
        return res.status(400).json({ message: 'columnId and title are required' });
      }

      const columnCheck = await pool.query(
        'SELECT id FROM columns_tbl WHERE id = $1 AND board_id = $2',
        [Number(columnId), boardId]
      );

      if (columnCheck.rowCount === 0) {
        return res.status(404).json({ message: 'Column not found for board' });
      }

      const positionResult = await pool.query(
        'SELECT COALESCE(MAX(position), 0) + 1 AS next_position FROM cards WHERE column_id = $1',
        [Number(columnId)]
      );

      const insertResult = await pool.query(
        `
        INSERT INTO cards (column_id, title, description, position)
        VALUES ($1, $2, $3, $4)
        RETURNING id, column_id, title, description, position
      `,
        [
          Number(columnId),
          title,
          description || '',
          Number(positionResult.rows[0].next_position)
        ]
      );

      const card = insertResult.rows[0];
      wsHub.broadcast({ type: 'card.created', boardId, payload: card });

      res.status(201).json(card);
    } catch (err) {
      next(err);
    }
  });

  router.patch('/:boardId/cards/:cardId/move', async (req, res, next) => {
    try {
      const boardId = Number(req.params.boardId);
      const cardId = Number(req.params.cardId);
      const { toColumnId, position } = req.body;

      if (!toColumnId || typeof position !== 'number') {
        return res.status(400).json({ message: 'toColumnId and numeric position are required' });
      }

      const cardResult = await pool.query('SELECT id, column_id FROM cards WHERE id = $1', [cardId]);
      if (cardResult.rowCount === 0) {
        return res.status(404).json({ message: 'Card not found' });
      }

      const columnCheck = await pool.query(
        'SELECT id FROM columns_tbl WHERE id = $1 AND board_id = $2',
        [Number(toColumnId), boardId]
      );
      if (columnCheck.rowCount === 0) {
        return res.status(404).json({ message: 'Destination column not found for board' });
      }

      const updated = await pool.query(
        `
        UPDATE cards
        SET column_id = $1, position = $2
        WHERE id = $3
        RETURNING id, column_id, title, description, position
      `,
        [Number(toColumnId), Number(position), cardId]
      );

      wsHub.broadcast({
        type: 'card.moved',
        boardId,
        payload: updated.rows[0]
      });

      res.json(updated.rows[0]);
    } catch (err) {
      next(err);
    }
  });

  return router;
}

module.exports = { createBoardsRouter };
