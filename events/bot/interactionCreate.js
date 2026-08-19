registerEvent(scriptName, async interaction => {
  if (isType.interaction(interaction, "ApplicationCommand")) {
    Object.defineProperty(interaction, "command", {
      value: undefined,
      configurable: true
    })
    if (isType.command(interaction, "ChatInput")) return runSlashCommand(interaction)
    else return runContextCommand(interaction)
  } else if (isType.interaction(interaction, "ApplicationCommandAutocomplete")) {
    const respond = interaction.respond.bind(interaction)
    interaction.respond = data => respond(data).catch(() => {})
    let command = client.slashCommands.get(interaction.commandName)
    if (!command) {
      return interaction.respond([{ name: "This command no longer exists", value: "unregistered" }])
    }
    let subCommand
    if (!command.execute) {
      subCommand = interaction.options.getSubcommandGroup() ?? interaction.options.getSubcommand()
      command = command.get(subCommand)
      if (!command?.execute) {
        subCommand = interaction.options.getSubcommand()
        command = command?.get(subCommand)
      }
    }
    if (!command) {
      return interaction.respond([{ name: "This command no longer exists", value: "unregistered" }])
    }
    let name
    for (const option of interaction.options.data) {
      if (option.focused) {
        name = option.name
        break
      } else if (option.options) for (const option2 of option.options) {
        if (option2.focused) {
          name = option2.name
          break
        } else if (option2.options) for (const option3 of option2.options) {
          if (option3.focused) {
            name = option3.name
            break
          }
        }
      }
    }
    const autocomplete = command.arguments?.find(e => e.id === name)?.autocomplete
    if (!autocomplete) return interaction.respond([])
    if (typeof autocomplete === "function") autocomplete(interaction, interaction.options.getFocused().toLowerCase(), interaction.options)
    else if (Array.isArray(autocomplete)) interaction.respond(filteredSort(autocomplete, interaction.options.getFocused().toLowerCase(), 25).map(e => ({ name: e, value: e })))
    else {
      const split = autocomplete.split(":")
      client.autocompletes.get(split[0]).execute(interaction, interaction.options.getFocused().toLowerCase(), interaction.options, split[1])
    }
  } else if (interaction.isButton()) {
    return buttonHandler(interaction)
  }
})