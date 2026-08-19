// tries the interaction reply first, then editing the processing message, then replying, then a
// plain channel send. interactions return the interaction itself with .message set, everything
// else returns the sent message
async function send(message, channel, processing, content) {
  await preprocessMessage(message, content)
  if (processing instanceof Discord.BaseInteraction) processing = processing.message
  const interaction = message.interaction ?? message
  let deliveryError
  if (interaction instanceof Discord.BaseInteraction) {
    let sent
    try {
      content.fetchReply = true
      if (interaction.replied || interaction.deferred) {
        sent = await interaction.editReply(content)
      } else {
        sent = await interaction.reply(content)
      }
      interaction.message = sent
      return interaction
    } catch (err) {
      try {
        if (isType.error(err, "MessageWasBlockedByAutomaticModeration")) {
          const blocked = {
            components: [component.container(message, ["## Response blocked by AutoMod\nThe response was blocked by AutoMod and could not be sent"])],
            flags: getFlag.message("IsComponentsV2")
          }
          if (interaction.replied || interaction.deferred) {
            sent = await interaction.editReply(blocked)
          } else {
            sent = await interaction.reply(blocked)
          }
          interaction.message = sent
          return interaction
        }
      } catch (err) {
        if (isType.error(err, "MessageWasBlockedByAutomaticModeration")) return interaction
      }
      deliveryError = err
    }
    if (processing instanceof Discord.Message) {
      try {
        return await processing.edit(content)
      } catch {}
    }
  } else {
    if (processing instanceof Discord.Message) {
      try {
        return await processing.edit(content)
      } catch {}
    }
    try {
      return await message.reply(content)
    } catch (err) {
      deliveryError = err
    }
  }
  if (typeof channel.send !== "function" || message.guildId && !channel.guild) {
    throw deliveryError ?? new Error(`Unable to send message as the channel is not accessible (${channel.constructor?.name ?? typeof channel}${channel.id ? ` ${channel.id}` : ""}${message.guildId ? `, guild ${message.guildId}` : ""})`)
  }
  return await channel.send(content)
}

registerFunction(scriptName, {
  async sendMessage(message, args, processing) {
    if (!message) return
    const origin = new Error().stack
    try {
      const channel = message.channel ?? message
      if (channel.archived && channel.locked && !hasPerm(channel.guild.members.me, "ManageThreads", channel)) {
        if (args.error) sendError(args.error, {
          title: "Unable to send message",
          description: `The channel ${channel} is both archived and locked`
        })
        return
      }
      // components v2 messages cannot have content, so content-only sends stay plain
      if (args.content !== undefined) {
        return await send(message, channel, args.processing ?? processing, {
          allowedMentions: args.allowedMentions ?? (args.ping ? { repliedUser: true, parse: ["users", "roles"] } : { parse: ["users"] }),
          content: args.content,
          files: args.files,
          components: args.components,
          ephemeral: args.ephemeral
        })
      }
      args = makeComponents(message, args)
      // deletable adds a bin button that lets the author (or a mod) delete the response
      if (args.deletable && !(message.command?.application && args.ephemeral)) {
        args.components.push(component.row(component.button({
          emoji: client.emotes.binWhite,
          style: "red",
          id: `delete_${message.author.id}`
        })))
      }
      return await send(message, channel, args.processing ?? processing, {
        allowedMentions: args.allowedMentions ?? (args.ping ? { repliedUser: true, parse: ["users", "roles"] } : {}),
        components: args.components,
        files: args.files,
        ephemeral: args.ephemeral,
        flags: args.flags
      })
    } catch (err) {
      if (err && typeof err === "object") err.origin = origin
      throw err
    }
  },
  async sendPrivateMessage(interaction, args, processing) {
    const origin = new Error().stack
    try {
      if (args.content !== undefined) {
        const sent = await interaction.reply({
          content: args.content,
          components: args.components,
          files: args.files,
          ephemeral: true,
          fetchReply: true
        })
        interaction.message = sent
        return interaction
      }
      args = makeComponents(interaction, args)
      await preprocessMessage(interaction, args)
      const sent = await interaction.reply({
        components: args.components,
        files: args.files,
        flags: args.flags,
        ephemeral: true,
        fetchReply: true
      })
      interaction.message = sent
      return interaction
    } catch (err) {
      if (err && typeof err === "object") err.origin = origin
      throw err
    }
  }
})