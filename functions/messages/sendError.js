registerFunction(scriptName, {
  // red container with a delete button. failing a command also clears its cooldown unless
  // ignoreCooldown is set
  async sendError(message, data) {
    if (!message) return
    const origin = new Error().stack
    try {
      if (message.command && !data.ignoreCooldown) clearCooldown(message)
      const channel = message.channel ?? message

      const parts = [`## ${data.title ?? "Error"}`]
      if (data.description) parts.push(data.description)
      const contents = [parts.join("\n")]
      if (data.fields) {
        for (const field of data.fields) {
          contents.push(`### ${field[0]}\n${field[1]}`)
        }
      }
      if (data.footer) {
        contents.push(`-# ${data.footer}`)
      }
      const components = [component.container(message, {
        colour: parseInt(client.colours.error.replace("#", ""), 16),
        components: contents
      })]
      if (data.components) {
        components.push(...data.components)
      }
      if (!(message.command?.application && data.ephemeral !== false) && data.deletable !== false) {
        components.push(component.row(component.button({
          emoji: client.emotes.binWhite,
          style: "red",
          id: `delete_${message.author.id}`
        })))
      }
      const flags = getFlag.message("IsComponentsV2")

      const interaction = message.interaction ?? message
      let deliveryError
      if (interaction instanceof Discord.BaseInteraction) {
        try {
          let sent
          if (interaction.replied || interaction.deferred) {
            sent = await interaction.editReply({
              allowedMentions: {},
              components,
              flags,
              fetchReply: true
            })
          } else {
            sent = await interaction.reply({
              allowedMentions: {},
              components,
              flags,
              ephemeral: data.ephemeral === false ? false : true,
              fetchReply: true
            })
          }
          interaction.message = sent
          return interaction
        } catch (err) {
          deliveryError = err
        }
      } else {
        if (data.processing instanceof Discord.Message) {
          try {
            return await data.processing.edit({
              allowedMentions: {},
              components,
              flags
            })
          } catch {}
        }
        try {
          return await message.reply({
            allowedMentions: {},
            components,
            flags
          })
        } catch (err) {
          deliveryError = err
        }
      }
      if (typeof channel.send !== "function" || message.guildId && !channel.guild) {
        throw deliveryError ?? new Error(`Unable to send error message as the channel is not accessible (${channel.constructor?.name ?? typeof channel}${channel.id ? ` ${channel.id}` : ""}${message.guildId ? `, guild ${message.guildId}` : ""})`)
      }
      return await channel.send({
        components,
        flags
      })
    } catch (err) {
      if (err && typeof err === "object") err.origin = origin
      throw err
    }
  },
  sendPrivateError(interaction, data) {
    if (interaction.command && !data.ignoreCooldown) clearCooldown(interaction)
    const parts = [`## ${data.title ?? "Error"}`]
    if (data.description) parts.push(data.description)
    const contents = [parts.join("\n")]
    if (data.fields) {
      for (const field of data.fields) {
        contents.push(`### ${field[0]}\n${field[1]}`)
      }
    }
    return interaction.reply({
      components: [component.container(interaction, {
        colour: parseInt(client.colours.error.replace("#", ""), 16),
        components: contents
      }), ...data.components ?? []],
      flags: getFlag.message("IsComponentsV2"),
      ephemeral: true
    })
  }
})