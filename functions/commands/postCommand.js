registerFunction(scriptName, async message => {
  const name = message.command.command ?? message.command.name
  if (client.commandInstances[name]?.includes(message.channelId)) {
    client.commandInstances[name].splice(client.commandInstances[name].indexOf(message.channelId), 1)
    if (!client.commandInstances[name].length) delete client.commandInstances[name]
  }
  // by default a cooldown only lasts for the duration of the command, set autoClearCooldown: false
  // on the command to make it persist for the full cooldown time
  if (message.command.autoClearCooldown !== false) clearCooldown(message)
})