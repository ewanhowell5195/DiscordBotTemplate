// asks the command author to confirm or cancel. resolves [true|false|null, message], where null
// means the prompt timed out. set danger: true for a red warning style
registerFunction(scriptName, async (message, args) => {
  let confirmMessage
  const buttons = component.row(
    component.button({
      label: args.text ?? "Confirm",
      id: "yes",
      style: args.danger ? "red" : "green",
      emoji: args.emoji ?? client.emotes.tickWhite
    }),
    component.button({
      label: args.cancel ?? "Cancel",
      emoji: client.emotes.crossWhite,
      id: "no"
    })
  )
  const container = component.container(message, {
    colour: args.danger ? parseInt(client.colours.error.replace("#", ""), 16) : undefined,
    components: [
      [
        args.danger ? "## Warning!" : undefined,
        args.title ? (args.danger ? `**${args.title}**` : `## ${args.title}`) : undefined,
        args.description
      ].filter(Boolean).join("\n"),
      ...(args.fields ?? []).map(e => `### ${e[0]}\n${e[1]}`)
    ]
  })
  const contents = {
    components: [container, buttons],
    processing: args.processing,
    files: args.files
  }
  const author = message.author ?? message.user
  if (args.private) {
    await sendPrivateMessage(message, contents)
    confirmMessage = message.message
    message = args.message
  }
  else confirmMessage = await sendMessage(message, contents)
  let timeout = true
  return new Promise(async fulfil => {
    await interactionHandler(confirmMessage, (interaction, collector) => {
      interaction.deferUpdate().catch(() => {})
      timeout = false
      collector.stop()
      if (interaction.customId === "yes") fulfil([true, confirmMessage])
      else fulfil([false, confirmMessage])
    }, {
      author,
      disable: false
    })
    if (!args.keep) {
      // strip the buttons once answered
      editMessage(confirmMessage, {
        components: [container]
      })
    }
    if (timeout) {
      fulfil([null, confirmMessage])
    }
  })
})