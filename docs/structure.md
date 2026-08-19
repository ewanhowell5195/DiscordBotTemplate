# Structure

Every script runs inside a shared vm context, so anything registered anywhere is available everywhere as a global. Files never import each other.

| Folder | Purpose |
|-|-|
| `commands/prefix/` | Prefix commands, organised into category folders |
| `commands/slash/` | Slash commands. Folders create subcommands |
| `commands/context/` | Context menu commands |
| `argtypes/` | Argument types used to parse and validate command arguments |
| `autocompletes/` | Shared autocomplete handlers, referenced by name from arguments |
| `functions/` | Global functions, registered with `registerFunction` |
| `loadins/` | Modules with load/unload lifecycles |
| `events/` | Discord client events, named by event |
| `database/` | The better-sqlite3 database and its prepared statements |

## Script globals

Every script gets:

- `scriptName` - the file name without the extension
- `prefixPath` - the file's path relative to `commands/prefix`, as an array
- `slashPath` - the file's path relative to `commands/slash`, as an array
- everything from the `scope` object in `index.js` (`Discord`, `fs`, `tokens`, etc)
- `config`, `client`, `db`, `database`, `testMode`, and every registered function

## Registering things

- `registerFunction(scriptName, func)` - registers a global function. Pass an object to register several at once, keyed by name
- `registerPrefixCommand(scriptName, prefixPath, command)` - see [commands.md](commands.md)
- `registerSlashCommand(scriptName, slashPath, command)` - see [application-commands.md](application-commands.md)
- `registerContextCommand(scriptName, command)` - see [application-commands.md](application-commands.md)
- `registerArgType(scriptName, argType)` - see [arguments.md](arguments.md)
- `registerAutocomplete(scriptName, execute)` - see [arguments.md](arguments.md)
- `registerEvent(scriptName, event)` - registers a client event handler. The file name is the event name, so `events/messages/messageCreate.js` handles `messageCreate`
- `registerLoadIn(scriptName, { load, unload })` - a module with a lifecycle. `load` runs on every reload and is awaited before argtypes and commands load, `unload` runs before the next reload

## Reloading

`!reload` (or calling `reloadAll()`) tears everything down and loads every script again without restarting the bot. All sources are read up front, so saving a file mid-reload cannot produce a half old, half new bot. Events received during a reload are dropped.

## Errors

Uncaught errors and unhandled rejections get reported to `config.channels.errors`, or the console in dev mode. Errors thrown inside a command execute get caught by the runner and reported through `commandError`, which also tells the user something went wrong.