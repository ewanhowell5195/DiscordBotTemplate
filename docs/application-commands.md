# Application commands

## Slash commands

Files in `commands/slash/` register slash commands. A slash command inherits its arguments, description, permissions, cooldowns, and execute from the prefix command with the same name, so most files are just:

```js
registerSlashCommand(scriptName, slashPath, {})
```

Inherited arguments run through the same argtypes as prefix commands, so one command definition covers both.

### Different name

Set `command` to inherit from a differently named prefix command. `commands/slash/dice.js` creates `/dice` running the `roll` command:

```js
registerSlashCommand(scriptName, slashPath, {
  command: "roll"
})
```

### Different definition

Provide `arguments` and `execute` when the slash version needs to differ. The echo command adds a spoiler option and passes through to the prefix execute:

```js
registerSlashCommand(scriptName, slashPath, {
  arguments: [
    {
      name: "message",
      description: "The message to echo",
      maxLength: 128,
      required: true
    },
    {
      type: "boolean",
      name: "spoiler",
      description: "Hide the message behind a spoiler"
    }
  ],
  execute(interaction, content, spoiler) {
    return interaction.command.prefixCommand.execute(interaction, spoiler ? `||${content}||` : content)
  }
})
```

Slash arguments support the types `string`, `number`, `integer`, `boolean`, `member`, `channel`, `role`, and `attachment`. String `options` arrays become choices.

### Subcommands

A folder under `commands/slash/` creates a command whose files are subcommands, and a folder inside that creates a subcommand group. The folder needs a `command.json`:

```json
{
  "description": "Commands for managing notes",
  "permissions": ["ManageMessages"],
  "guildOnly": true
}
```

## Context menu commands

Files in `commands/context/` register right-click commands. They also inherit from a prefix command:

```js
registerContextCommand(scriptName, {
  name: "View Avatar",
  command: "avatar",
  contextType: "User"
})
```

- `contextType` - `"User"` or `"Message"` (the default)
- User commands get the target member prepended to the execute arguments
- Message commands get `interaction.reference` set to the target message, matching a reply
- A context command with `arguments` collects them through a modal, since context menus have no options

## Deploying

`!deploy` registers everything to the current server, `!deploy global` registers globally. Guild commands update instantly, global commands can take a while to appear. Redeploy after changing any argument, description, or permission. In dev mode `!deploy` defaults to guild, otherwise it defaults to global.