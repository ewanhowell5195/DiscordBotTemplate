# Getting started

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
   The `private` folder is gitignored, so nothing in it will ever be committed.
3. Fill in `config.json`:
   - `prefix` - the prefix for prefix commands
   - `colour` - the accent colour used on message containers
   - `owners` - user IDs that can use the restricted commands
   - `channels.errors` - a channel ID where errors get logged
4. Enable the **Server Members** and **Message Content** intents on the [Discord developer portal](https://discord.com/developers/applications).
5. Start the bot:
   ```
   node --no-warnings index.js -dev
   ```
   The `-dev` flag logs errors to the console instead of the error channel.
6. Run `!deploy` in a server to register the application commands to that server, or `!deploy global` to register them globally. Redeploy whenever a command's arguments, description, or permissions change.

## Owner commands

- `!reload` - reload every script without restarting the bot
- `!restart` - shut down the bot. A process manager (pm2, systemd, etc) needs to start it back up
- `!eval` - run code inside the bot and view the output
- `!deploy` - register the application commands

## Emojis

Custom emojis are loaded from your application's uploaded emojis by name. Upload them under **Emojis** on the developer portal. `snake_case` names become camelCase keys, so an emoji named `tick_white` is available as `client.emotes.tickWhite`.

Most of the names the template uses (`tickWhite`, `crossWhite`, `binWhite`, `pencilWhite`, `arrowRightWhite`, etc) fall back to unicode emojis when no matching application emoji exists, so everything works before you upload anything. Names without a fallback (`prefixWhite`, `slashWhite`) just render their buttons without an emoji.

## Database

The bot creates `database.db` on first run. See [database.md](database.md) for how to add tables.