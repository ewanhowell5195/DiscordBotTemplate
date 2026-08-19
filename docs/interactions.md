# Interactions

## interactionHandler(message, func, args)

Collects button, select, and modal interactions on a message. `func(interaction, collector, state)` runs for each one. Set `state.timeout = false` and call `collector.stop()` once the interaction is finished with.

Options:

- `timeout` - seconds of inactivity before stopping, default 60. `fixed: true` stops the timer resetting on activity
- `author` - reject other users with an ephemeral notice
- `delete` - delete the message on timeout
- `timeoutMessage` - message data to edit in on timeout
- `disable: false` - skip the default disabling of the message's components on timeout

Resolves the state object. Push any extra messages you send to `state.messages` and their components get disabled too.

## modalHandler(message, modalMessage, options)

Runs a modal flow. For a fresh slash command the modal opens directly. For prefix commands (or when already replied) it sends a prompt message with a button that opens the modal.

```js
const modal = await modalHandler(message, undefined, {
  prompt: {
    description: "Press the button to set your note",
    button: {
      label: "Set note",
      emoji: client.emotes.pencilWhite,
      id: "modal"
    }
  },
  modal: {
    title: "Note Editor",
    rows: [
      {
        label: "Note",
        component: component.input({
          id: "note",
          maxLength: 512,
          required: true
        })
      },
      {
        label: "Private",
        description: "Only you can view a private note",
        component: component.checkbox({ id: "private" })
      }
    ]
  }
})
if (modal.timeout) return
const target = modal.interaction ?? message
```

Options:

- `prompt` - message data for the prompt. Include a button with id `"modal"`, and optionally one with id `"skip"`
- `modal` - `{ title, rows }`. Rows are strings (text displays) or `{ label, description, component }` with extra handling fields below
- `onSubmit(fields, interaction, { state, skipped })` - return true to finish, or falsy to keep collecting for multi step flows
- `onTimeout(state)` - replaces the default timeout message
- `onInteraction(interaction, { state, fields })` - receives any other button presses on the prompt
- `authorOnly` - default true
- `timeout` - seconds, default 300

Resolves `{ fields, timeout, interaction?, message? }`. `fields` is keyed by component id. When the modal opened directly, `interaction` is the unacknowledged submit, so reply to it (or pass it to the next step) instead of the original message. `message` is the prompt message for threading with `processing`.

### Row handling fields

On text input rows:

- `type` - `"url"`, `"number"`, or `"boolean"` converts and validates the value
- `func(value, fields)` - transform the value
- `validation(value, fields)` - return an error string (or `{ message, required, fields }`) to reject it
- `invalidChars` - a regex of characters to reject
- `min` / `max` - bounds for number types
- `default` - used when the field is left empty

Rows can also hold checkboxes, radio groups, and select menus. Invalid submissions edit the prompt into an error summary with re-enter and skip buttons, and the reopened modal only contains the fields that failed.

## choose(message, args)

Asks the command author to pick an option. Resolves `[choice, message]` where choice is the option index as a string, or null on timeout.

```js
const choice = await choose(message, {
  title: "Rock Paper Scissors",
  description: "Pick your move!",
  options: ["Rock", "Paper", "Scissors"]
})
if (!choice[0]) return
```

`options` entries can be strings, `{ label, emoji, style }` objects, or emojis with `emoji: true`. `select: true` uses a select menu of `[label, description]` pairs instead of buttons. `danger` for the red warning style, `message` to edit an earlier message, `keep` to leave the buttons afterwards.

## confirm(message, args)

Confirm or cancel buttons. Resolves `[true|false|null, message]`.

```js
const check = await confirm(message, {
  description: "Are you sure you want to replace it?",
  danger: true,
  processing: modalMessage
})
if (!check[0]) return editMessage(check[1], "Aborted")
```

Takes `title`, `description`, `fields`, `danger`, `text` and `cancel` (button labels), `emoji`, `processing`, `files`, and `keep`.

## paginationHandler(message, pages, args)

A paginated container with navigation buttons and a page select modal.

```js
paginationHandler(message, pages)
```

Pages can be strings, container content arrays, message shorthand objects (`title`, `description`, `fields`, `image`), or functions returning any of those for lazy loading. `args` takes `index`, `processing`, `ephemeral`, and `selector: { name, items, find }` to add a named lookup to the page select modal.

## buttonHandler(interaction)

Buttons outside any collector route here from the `interactionCreate` event. It handles the `delete_<userId>` buttons that `deletable` and `sendError` create, and is the place to add other persistent buttons.