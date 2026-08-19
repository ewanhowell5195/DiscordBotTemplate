// asks the command author to pick an option using buttons (or a select menu with select: true)
// resolves [choice, message], where choice is the picked option index (or select value) as a
// string, or null on timeout
registerFunction(scriptName, async (message, args) => {
  let components = []
  if (args.select) {
    components.push(component.row(
      component.select({
        placeholder: args.placeholder,
        options: args.options.map((e, i) => ({
          label: e[0],
          description: e[1],
          value: i.toString()
        }))
      })
    ))
  } else {
    const buttons = []
    if (args.emoji) {
      for (let x = 0; x < args.options.length; x++) {
        buttons.push(component.button({
          emoji: args.options[x],
          id: x.toString()
        }))
      }
    } else {
      for (let x = 0; x < args.options.length; x++) {
        if (!args.options[x]) continue
        if (typeof args.options[x] === "string") {
          buttons.push(component.button({
            label: args.options[x],
            id: x.toString()
          }))
        } else {
          buttons.push(component.button({
            label: args.options[x].label,
            emoji: args.options[x].emoji,
            style: args.options[x].style,
            id: x.toString()
          }))
        }
      }
    }
    // action rows fit five buttons, so longer option lists wrap onto extra rows
    for (let x = 0; x < buttons.length; x++) {
      if (x % 5 === 0) components.push([])
      components[Math.floor(x / 5)].push(buttons[x])
    }
    components = components.map(e => component.row(...e))
  }
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
  const optionMessage = await sendMessage(message, {
    components: [container, ...components],
    processing: args.message
  })
  let timeout = true
  return new Promise(async fulfil => {
    await interactionHandler(optionMessage, (interaction, collector) => {
      interaction.deferUpdate()
      timeout = false
      collector.stop()
      fulfil([interaction.values?.[0] ?? interaction.customId, optionMessage])
    }, {
      author: message.author,
      disable: false
    })
    if (timeout) {
      if (!args.keep) {
        editMessage(optionMessage, "The command timed out…")
      }
      fulfil([null, optionMessage])
    } else if (!args.keep) {
      // strip the option buttons once a choice has been made
      editMessage(optionMessage, {
        components: [container]
      })
    }
  })
})