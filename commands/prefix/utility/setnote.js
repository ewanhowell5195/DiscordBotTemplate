// demonstrates the modal system (with a direct modal from the slash command), confirm, and the database
registerPrefixCommand(scriptName, prefixPath, {
  description: "Set a note about yourself.",
  async execute(message) {
    const existing = db.notes.get(message.author.id)
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
              placeholder: "Write something about yourself",
              value: existing?.note,
              long: true,
              required: true
            })
          },
          {
            label: "Private",
            description: "Only you can view a private note",
            component: component.checkbox({
              id: "private",
              default: !!existing?.private
            })
          }
        ]
      }
    })
    if (modal.timeout) return
    const target = modal.interaction ?? message
    let modalMessage = modal.message
    if (existing) {
      const check = await confirm(target, {
        description: "You already have a note\n\nAre you sure you want to replace it?",
        danger: true,
        processing: modalMessage
      })
      if (!check[0]) return editMessage(check[1], "The note update has been aborted")
      modalMessage = check[1]
    }
    db.notes.set(message.author.id, modal.fields.note, modal.fields.private ? 1 : 0)
    sendMessage(message, `Your note has been ${existing ? "updated" : "set"}`, modalMessage)
  }
})