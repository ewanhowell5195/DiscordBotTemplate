// demonstrates pagination
registerPrefixCommand(scriptName, prefixPath, {
  description: "View all the public notes.",
  async execute(message) {
    const notes = db.notes.all().filter(e => !e.private)
    if (!notes.length) return sendError(message, {
      title: "No notes",
      description: `Nobody has set a note yet\n\nUse ${await getCommandName(message, "setnote")} to set one`
    })
    const pages = []
    for (let i = 0; i < notes.length; i += 5) {
      pages.push({
        title: "Notes",
        description: notes.slice(i, i + 5).map(e => `<@${e.id}>\n> ${limit(e.note, 256)}`).join("\n\n")
      })
    }
    paginationHandler(message, pages)
  }
})