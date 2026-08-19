# Messages

Every message the bot sends is components v2, rendered as a container with the bot's accent colour. The message helpers accept several shapes and handle prefix and slash contexts the same way.

## sendMessage(message, args, processing?)

`args` can be:

- a string - a container with one line of text
- an array - container contents (strings and `component.*` builders)
- a `component.container(...)` builder
- an object

The object form takes either raw top level `components`, or the embed style shorthand:

```js
sendMessage(message, {
  title: "Pong",                  // ## heading, add url to make it a link
  description: "Some text",
  fields: [["Name", "Value"]],    // ### Name followed by the value
  image: "https://...",           // also takes attachment://file.png
  thumbnail: "https://...",
  footer: "Small text at the bottom",
  button: { label: "A link", url: "https://..." },
  colour: 0xFF0000                // overrides the accent colour, null removes it
})
```

Other options:

- `content` - sends a plain message instead, since components v2 messages cannot have content
- `files` - attachments, see [makeFile](#files) definitions
- `processing` - a message to edit instead of sending a new one (also the third parameter)
- `ephemeral` - for slash commands
- `deletable` - adds a bin button that lets the author (or a mod) delete the response
- `ping` - allow the reply to ping. Mentions do not ping by default
- `allowedMentions` - full control over pings

Returns the sent message. For slash commands it returns the interaction with `.message` set, and every helper accepts that wrapper anywhere a message is expected.

`sendPrivateMessage(interaction, args)` is the same but always ephemeral.

## editMessage(message, args)

Same shapes as sendMessage. Failures are swallowed unless `crash: true` is set. `editPrivateMessage(interaction, args)` edits an ephemeral reply.

## sendError(message, data)

A red container that also clears the command's cooldown, so a failed command can be retried immediately (`ignoreCooldown: true` skips that). Takes `title` (defaults to "Error"), `description`, `fields`, `footer`, extra `components`, and `processing`. Slash errors are ephemeral unless `ephemeral: false`. Every error gets the delete button unless `deletable: false`.

`sendPrivateError(interaction, data)` is the ephemeral-only version.

## The processing pattern

For slow commands, send a processing state first and replace it when done:

```js
const processing = await sendProcessing(message)
const result = await somethingSlow()
sendMessage(message, {
  description: result,
  processing
})
```

For slash commands `sendProcessing` defers the reply, for prefix commands it sends a "Processing..." message.

## Files

`makeFile(data)` builds an attachment from `{ name }` plus one of `buffer`, `path`, `url`, or `text`. File definitions in a `files` array are converted automatically.

`sendFile(message, data)` sends a single file with friendly errors for save failures and the upload limit:

```js
sendFile(message, {
  name: "message.txt",
  buffer: Buffer.from(content, "utf8")
})
```

## Other helpers

- `deleteMessage(message)` - delete if the bot owns it or has permission
- `deleteAfter(message, time)` - delete after a delay, default 5 seconds
- `react(message, emoji)` - react with a unicode emoji or an emoji ID. Slash commands get the emoji as a reply instead
- `timedReact(message, emoji, time)` - react and remove it after a delay
- `getCommandName(message, command?, args?, forceType?)` - render a command mention that matches how the command was invoked: a clickable slash mention for slash, `` `!name` `` for prefix. Use whenever output references another command