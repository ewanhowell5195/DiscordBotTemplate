async function edit(message, content) {
  await preprocessMessage(message, content)
  const interaction = message.interaction ?? message
  if (content.files) {
    for (let i = 0; i < content.files.length; i++) {
      if (!(content.files[i] instanceof Discord.AttachmentBuilder)) {
        content.files[i] = await makeFile(content.files[i])
      }
    }
  }
  if (interaction instanceof Discord.BaseInteraction) {
    content.fetchReply = true
    interaction.message = await interaction.editReply(content)
    return interaction
  }
  return message.edit(content)
}

// accepts the same args shapes as sendMessage. pass crash: true to throw on failure instead of
// swallowing it
registerFunction(scriptName, {
  editMessage(message, args) {
    if (!(message instanceof Discord.Message) && !(message instanceof Discord.BaseInteraction)) return
    if (args.content !== undefined) {
      return edit(message, {
        allowedMentions: args.allowedMentions ?? (args.ping ? { repliedUser: true, parse: ["users", "roles"] } : { parse: ["users"] }),
        content: args.content,
        components: args.components,
        files: args.files
      }).catch(e => {
        if (args.crash) throw e
      })
    }
    args = makeComponents(message, args)
    return edit(message, {
      allowedMentions: args.allowedMentions ?? (args.ping ? { repliedUser: true, parse: ["users", "roles"] } : {}),
      components: args.components,
      files: args.files,
      flags: args.flags
    }).catch(e => {
      if (args.crash) throw e
    })
  },
  async editPrivateMessage(interaction, args) {
    if (args.content !== undefined) {
      const sent = await interaction.editReply({
        content: args.content,
        components: args.components,
        files: args.files,
        ephemeral: true,
        fetchReply: true
      }).catch(e => {
        if (args.crash) throw e
      })
      interaction.message = sent
      return interaction
    }
    args = makeComponents(interaction, args)
    await preprocessMessage(interaction, args)
    const sent = await interaction.editReply({
      components: args.components,
      files: args.files,
      flags: args.flags,
      ephemeral: true,
      fetchReply: true
    }).catch(e => {
      if (args.crash) throw e
    })
    interaction.message = sent
    return interaction
  }
})