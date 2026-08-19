# Prefix commands

Files in `commands/prefix/` register prefix commands. The folder structure defines the command categories shown by the help command.

```js
registerPrefixCommand(scriptName, prefixPath, {
  description: "Roll a dice.",
  aliases: ["dice"],
  arguments: [{
    type: "number",
    name: "sides",
    description: "The number of sides on the dice",
    default: 6
  }],
  execute(message, sides) {
    return sendMessage(message, `You rolled a **${randInt(sides - 1) + 1}**`)
  }
})
```

## Fields

- `description` - a sentence, or an array of paragraphs. The first paragraph doubles as the slash command description
- `aliases` - alternative command names
- `arguments` - see [arguments.md](arguments.md)
- `execute(message, ...args)` - the parsed arguments are spread in, in order. If the command has arguments, a processing message created during parsing is appended as the final argument
- `permissions` - Discord permission names the user needs, eg `["ManageGuild"]`. Two special values exist: `"BotOwner"` restricts to `config.owners`, and `"Moderator"` restricts to members passing `isMod` (any of `client.modPermissions`)
- `guildOnly` / `dmOnly` - where the command can run
- `cooldown` - seconds between uses, default 1. `cooldownType` is `"guild"` (shared per server, the default) or `"user"`
- `autoClearCooldown` - by default a cooldown is cleared when the command finishes, so it only guards against overlapping runs. Set to `false` to make it persist for the full time
- `typingless` - skip the typing indicator
- `singleUse` - only one instance of the command can run per channel at a time
- `quotes` - let users quote arguments containing spaces
- `links` - `[["Label", "url"]]` pairs shown as buttons on the command's help page
- `requirement` - `{ check(message), error }` for custom gating. `error` can be a string or a function

## Categories

Each folder under `commands/prefix/` is a category. A `category.json` in the folder can provide a `description` for its help page:

```json
{
  "description": "Fun commands to play around with"
}
```

Commands in a `restricted` folder are hidden from help and command suggestions for anyone who is not an owner or moderator.

## Wrong commands

When a user types a command that does not exist, the closest match is suggested with buttons to run it, delete the message, or view its help page.