# DiscordBotTemplate

A template for creating Discord bots with discord.js. Prefix, slash, and context menu commands share one definition, everything renders as components v2, and the whole bot hot reloads without restarting.

- Prefix commands with typed, validated arguments that slash commands inherit automatically
- Components v2 output everywhere, with an embed style shorthand for building containers
- Modals with validation and error recovery, opening directly from slash commands
- Interaction helpers: confirm and choose prompts, pagination, persistent buttons
- Autocompletes, cooldowns, permissions, a help command that documents everything itself
- A better-sqlite3 database with prepared statement helpers
- `!reload` reloads every script in place

## Setup

1. `npm install`
2. Create `private/tokens.json` containing `{ "discord": "YOUR_BOT_TOKEN" }`
3. Fill in `config.json` with your prefix, colour, owner IDs, and error channel
4. `node --no-warnings index.js -dev`
5. Run `!deploy` to register the application commands

See [getting started](docs/getting-started.md) for the full setup.

## Docs

- [Getting started](docs/getting-started.md) - setup, config, owner commands, emojis
- [Structure](docs/structure.md) - folders, the script loader, registering things, reloading
- [Commands](docs/commands.md) - prefix commands, categories, cooldowns, permissions
- [Arguments](docs/arguments.md) - argument definitions, argtypes, autocompletes
- [Application commands](docs/application-commands.md) - slash commands, context menus, deploying
- [Messages](docs/messages.md) - sending, editing, errors, files, the processing pattern
- [Components](docs/components.md) - the component builders
- [Interactions](docs/interactions.md) - modals, confirm, choose, pagination, buttons
- [Database](docs/database.md) - tables and prepared statements

## Demo commands

The included commands each show off part of the template. `echo` has string arguments and a custom slash definition, `avatar` has a member argument and a context menu command, `roll` has a number argument with an autocomplete, `rps` uses choose, `textfile` uploads a file, and the `setnote`/`note`/`notes` trio covers modals, confirm, the database, and pagination. Delete them once you know your way around.