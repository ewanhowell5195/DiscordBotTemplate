database.prepare(`
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    note TEXT,
    private INTEGER DEFAULT 0
  )
`).run()

export default {
  set: prepareDBAction(`
    INSERT INTO notes (id, note, private)
    VALUES (?, ?, ?)
    ON CONFLICT (id) DO UPDATE
    SET note = ?, private = ?
  `, "run", (id, note, priv) => [id, note, priv, note, priv]),
  get: prepareDBAction(`
    SELECT note, private
    FROM notes
    WHERE id = ?
  `, "get"),
  all: prepareDBAction(`
    SELECT id, note, private
    FROM notes
  `, "all"),
  remove: prepareDBAction(`
    DELETE FROM notes
    WHERE id = ?
  `)
}
