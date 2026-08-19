# DiscordBotTemplate

A template for creating Discord bots with discord.js, supporting prefix commands, slash commands, context menu commands, autocompletes, modals, and hot reloading.

## Setup

1. Install the dependencies:
   ```
   npm install
   ```
2. Create `private/tokens.json` with your bot token:
   ```json
   {
     "discord": "YOUR_BOT_TOKEN"
   }
   ```
3. Update `config.json` with your prefix, embed colour, owner user IDs, and an error log channel ID.
4. Start the bot:
   ```
   node --no-warnings index.js -dev
   ```
   The `-dev` flag logs errors to the console instead of the error channel.
5. Run `!deploy` in a server to register the application commands there, or `!deploy global` to register them globally.

## Structure

- `commands/prefix/` - prefix commands, organised into category folders
- `commands/slash/` - slash commands. Most just contain `registerSlashCommand(scriptName, slashPath, {})` and inherit their arguments, description, and permissions from the prefix command of the same name. Folders create subcommands, with an optional `command.json` for the group details
- `commands/context/` - context menu commands
- `argtypes/` - argument types used by command arguments
- `autocompletes/` - shared autocomplete handlers, referenced by name from command arguments
- `events/` - Discord client events, named by event
- `functions/` - globally available functions. Each file registers its exports with `registerFunction`, so they can be used anywhere without imports
- `loadins/` - modules with load/unload lifecycles, such as prototypes and emotes
- `database/` - a better-sqlite3 database with prepared statement helpers

Files run through a vm wrapper with shared globals, so nothing needs importing. `!reload` reloads every script without restarting the bot.

## Commands

Prefix commands define a `description`, `arguments`, `aliases`, `permissions`, and an `execute(message, ...args)` function. Arguments are validated by their `type` (an argtype), and the parsed values are passed to execute in order. The `help` command renders documentation for all of this automatically.

Custom emojis are loaded from your application's uploaded emojis by name, with unicode fallbacks for the names the template uses. Upload emojis to your application in the Discord developer portal to replace them.