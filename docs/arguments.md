# Arguments

Commands declare their arguments as objects. The runner parses, validates, and converts each one before execute runs, and the help command documents them automatically.

```js
arguments: [
  {
    type: "member",
    name: "member",
    description: "The member to greet",
    required: true
  },
  {
    name: "greeting",
    description: "The greeting to use",
    maxLength: 128,
    default: "Hello!"
  }
]
```

## Fields

- `type` - the argtype, default `"string"`
- `name` - the display name. The slash option name (`id`) is derived from it, camelCase becoming kebab-case
- `description` - shown in help and used as the slash option description. Required for anything a slash command inherits
- `required` - required arguments must come before optional ones
- `default` - used when the argument is not provided
- `rest` - the argument swallows the rest of the message. Applied automatically to the last argument unless its type cannot span words (number, integer, boolean, url). Set `rest: false` on the last argument to disable it
- `hidden` - excluded when a slash command inherits the arguments
- `autocomplete` - slash option autocomplete. A function `(interaction, text, options)`, an array of values, or the name of a handler in `autocompletes/` (optionally `"name:extra"` to pass an extra value through)

Per-type options go on the same object, eg `min`/`max` for numbers.

## Built-in argtypes

- `string` - `options` (array of allowed values, or a function returning them), `lowerCase`, `replaceMentions`, `minLength`, `maxLength`, `allowedCharacters`, `disallowedCharacters`
- `number` / `integer` - `min`, `max`. Accepts maths constants like `pi`
- `boolean` - accepts yes/no, true/false, on/off, 1/0, etc
- `url` - prepends `https://` when missing. `exists: true` also checks the URL responds
- `member` - accepts mentions, IDs, usernames, and the shortcuts `me`, `<<` (you, out of member context), `bot`, and `^` (the author of the previous or replied-to message). Options: `guildOnly`, `userOnly`, `self: false`, `bot: false`, `aboveSelf: false`, `aboveBot: false`
- `command` - resolves a prefix command, suggesting the closest match when not found. `categories: true` also resolves category names, `restricted: true` skips the restricted gate

## Writing an argtype

An argtype is a file in `argtypes/`, and the file name is the type name, so `argtypes/colour.js` creates `type: "colour"`. The simplest form is a function that returns the parsed value, or `undefined` for invalid input:

```js
registerArgType(scriptName, item => {
  if (item.match(/^#[0-9a-f]{6}$/i)) return item.toLowerCase()
})
```

The full form is an object:

```js
registerArgType(scriptName, {
  get(item, data, args) {},      // parse the raw input into a value
  validate(item, data, args) {}, // check the parsed value, return true to pass
  missing(args, message) {},     // extra text for the "missing required argument" error
  render(details, args) {},      // add rows to the argument's help entry
  autocomplete,                  // default autocomplete for the type
  description                    // default argument description for the type
})
```

The three parameters that flow through `get` and `validate`:

- `item` - the raw input: the word the user typed, or the slash option value
- `data` - the parse context, describing this particular invocation. `data.message` is the invoking message or interaction, and callers can pass flags like `errorless` (return `undefined` instead of sending an error) or `processing` (a processing message to thread errors onto)
- `args` - the argument definition from the command. Anything set on the argument object arrives here, which is how per-argument options like `min`, `max`, or `self: false` work. `args.name` and `args.id` are always available for error messages

So `data` is about how the argtype is being called, and `args` is about how the argument was declared.

In `missing(args, message)` and `render(details, args)`, `args` is again the argument definition. `message` is the invoking message, and `details` is an object of rows already containing the type name, where each key you add becomes a line on the help entry.

Return contract for `get` and `validate`:
- the parsed value - valid
- `undefined` - invalid, the runner sends a standard error
- a sent message (return the result of `sendError`) - invalid, and you already told the user why
- `null` - stop silently

## Autocompletes

Files in `autocompletes/` register shared handlers, and the file name is the name arguments reference, so `autocompletes/dice.js` is used with `autocomplete: "dice"`:

```js
registerAutocomplete(scriptName, (interaction, text, options, extra) => {
  interaction.respond([4, 6, 8, 10, 12, 20, 100].filter(e => e.toString().includes(text)).map(e => ({ name: `D${e}`, value: e })))
})
```

`text` is the lowercased input so far, `options` is `interaction.options` for reading other option values, and `extra` is the part after `:` when referenced as `"name:extra"`. Respond with up to 25 `{ name, value }` choices, and match the value type to the option type.