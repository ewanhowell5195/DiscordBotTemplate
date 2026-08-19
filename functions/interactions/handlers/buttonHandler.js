registerFunction(scriptName, async interaction => {
  if (interaction.customId.startsWith("delete_")) {
    if (interaction.user.id === interaction.customId.match(/^delete_(\d+)$/)[1] || hasPerm(interaction.member, "ManageMessages", interaction.channel) || isMod(interaction.member)) {
      deleteMessage(interaction.message)
      if (interaction.message.reference) {
        const message = await getMessage(interaction.channel, interaction.message.reference.messageId)
        if (message && !message.attachments?.size) deleteMessage(message)
      }
      return
    }
    return sendPrivateMessage(interaction, { description: "Only the message author can do that" })
  }
})