// demonstrates reading from the database
registerPrefixCommand(scriptName, prefixPath, {
  description: "View a member's note.",
  arguments: [{
    type: "member",
    name: "member",
    description: "The member to view the note of"
  }],
  async execute(message, member) {
    member ??= message.member
    const note = db.notes.get(member.id)
    if (!note || (note.private && member.id !== message.author.id)) return sendError(message, {
      title: "No note found",
      description: `${member.id === message.author.id ? "You do" : `${member} does`} not have a note set\n\nUse ${await getCommandName(message, "setnote")} to set one`
    })
    sendMessage(message, {
      title: `${member.displayName}'s note`,
      description: note.note
    })
  }
})