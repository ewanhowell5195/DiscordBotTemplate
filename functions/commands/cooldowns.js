registerFunction(scriptName, {
  cooldownCheck(message, command) {
    const id = command.cooldownType === "guild" ? message.guildId ?? message.channelId : message.author?.id
    const now = Date.now()
    if (command.cooldowns[id]) {
      if (now - command.cooldowns[id] > command.cooldown * 1000) {
        command.cooldowns[id] = now
        return true
      } else {
        sendError(message, {
          title: "Cooldown active",
          description: `Try again in \`${Math.ceil((command.cooldown - (now - command.cooldowns[id]) / 1000) * 10) / 10}\` seconds`,
          ignoreCooldown: true
        })
        return
      }
    } else {
      command.cooldowns[id] = now
      return true
    }
  },
  clearCooldown(message) {
    const id = message.command.cooldownType === "guild" ? message.guildId ?? message.channelId : message.author?.id
    delete message.command.cooldowns?.[id]
  }
})