registerArgType(scriptName, {
  async get(item, data, args) {
    item = item.toLowerCase()
    if (args.categories && client.categories[item]) return client.categories[item]
    let command = client.prefixCommands.get(item)
    if (!command) {
      command = client.prefixCommands.get(item.replace(new RegExp(`^(\/|${escapeStringRegexp(config.prefix)})`), ""))
    }
    if (command) return command
    command = await wrongCommand(item, data.message, data).catch(() => false)
    if (command) return command[0]
    return null
  },
  validate(item, data, args) {
    if (!args.restricted && item.parents?.includes("restricted") && !config.owners.includes(data.message.author.id)) {
      return sendError(data.message, {
        title: "Command restricted",
        description: `The ${item.name.quote()} command is a restricted command`
      })
    }
    return true
  }
})
