CREATE TABLE IF NOT EXISTS boards (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS columns_tbl (
  id SERIAL PRIMARY KEY,
  board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cards (
  id SERIAL PRIMARY KEY,
  column_id INTEGER NOT NULL REFERENCES columns_tbl(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO boards (name)
SELECT 'Demo Board'
WHERE NOT EXISTS (SELECT 1 FROM boards);

INSERT INTO columns_tbl (board_id, title, position)
SELECT b.id, c.title, c.position
FROM boards b
CROSS JOIN (
  VALUES
    ('Backlog', 1),
    ('In Progress', 2),
    ('Done', 3)
) AS c(title, position)
WHERE b.name = 'Demo Board'
  AND NOT EXISTS (SELECT 1 FROM columns_tbl WHERE board_id = b.id);
