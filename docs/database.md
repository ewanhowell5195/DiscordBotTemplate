# Database

The bot uses better-sqlite3 with a `database.db` file, opened in `index.js` and available everywhere as `database`. Queries are wrapped in prepared statement helpers and exposed as `db`.

## Adding a module

Create a file in `database/sql/` and register it in `database/db.js`:

```js
// database/sql/notes.js
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
  `, "get")
}
```

```js
// database/db.js
export default {
  notes: (await import("./sql/notes.js")).default
}
```

Then use it anywhere:

```js
db.notes.set(message.author.id, note, 0)
const note = db.notes.get(message.author.id)
```

## prepareDBAction(sql, run, input, output)

Prepares the statement once and returns a function that runs it.

- `run` - the better-sqlite3 method: `"run"`, `"get"`, or `"all"`. Default `"run"`
- `input(...args)` - maps the call arguments to the statement parameters, for reusing values or reshaping
- `output(result)` - transforms the result, eg parsing JSON columns

The database runs in WAL mode, and it is gitignored along with its sidecar files.