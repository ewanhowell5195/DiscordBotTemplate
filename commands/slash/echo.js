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
