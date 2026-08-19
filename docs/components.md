# Component builders

The `component` object builds components v2 elements. Strings inside a container become text displays, so most content is just markdown.

- `component.container(message, args)` - the box everything lives in. Pass an array of contents, or `{ colour, components }` to override the accent colour (`null` for no colour bar). Contents can be strings, buttons, selects, rows, sections, separators, galleries, media, and files
- `component.text(text)` - a text display, for when a bare string will not do (eg inside a modal)
- `component.row(...components)` - an action row. Fits five buttons or one select
- `component.section(contents, accessory)` - text with a button or thumbnail on the right. `contents` is a string, an array of strings, or text displays
- `component.button({ label, emoji, style, url, id, disabled, right })` - `style` is `"blue"`, `"green"`, `"red"`, or grey by default. `url` makes it a link button. `right: true` wraps it in a section so it sits on the right
- `component.select({ type, options, placeholder, id, minValues, maxValues })` - a select menu. `type: "channel"` or `"role"` for those pickers (`types` filters channel types, `defaults` preselects channels), otherwise a string select with `options` of `{ label, description, emoji, default, value }`
- `component.thumbnail(url, { spoiler, priority })` - a section accessory. Non-http urls become `attachment://` references
- `component.media(url, { spoiler })` - a gallery item, same url handling
- `component.gallery(...items)` - a media gallery, or pass `{ items, priority }`
- `component.separator(line, size)` - a divider, `line: false` for just spacing
- `component.file(name, spoiler)` - shows an attached file in the message body

## Modal components

- `component.modal(title, items, id)` - a modal from text displays and labels
- `component.label({ label, description, component })` - wraps an input for a modal row
- `component.input({ id, placeholder, value, required, long, maxLength, minLength })` - a text input, `long` for a paragraph box
- `component.checkbox({ id, default })`
- `component.radioGroup({ id, options, required })` - options are strings or `{ label, description, value, default }`
- `component.textInput({ id, label, description, ... })` - a label and text input in one, used by simple modals like the pagination page picker

The `modalHandler` builds modals for you from plain row definitions, see [interactions.md](interactions.md).

## Images in messages

To show a generated image, attach it and reference it by name:

```js
sendMessage(message, {
  image: "attachment://render.png",
  files: [{
    name: "render.png",
    buffer
  }]
})
```