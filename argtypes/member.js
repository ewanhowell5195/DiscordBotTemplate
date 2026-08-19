registerArgType(scriptName, {
  async get(item, data) {
    if (item instanceof Discord.GuildMember) {
      return item
    }
    item = item.toLowerCase()
    if (item === "<<" && !data.noText) {
      return createMember(data.message.author)
    }
    if (["self", "<", "me"].includes(item) && !data.noText && data.message.member) {
      return data.message.member
    }
    if (item === "bot") {
      return data.message.guild?.members.me ?? createMember(client.user)
    }
    if (item === "^" && !data.noText) try {
      if (data.message.reference) {
        const ref = await getMessage(data.message.channel, data.message.reference.messageId)
        return ref.member ?? createMember(ref.author)
      }
      if (!data.message.guild) {
        if (!data.errorless) return sendError(data.message, {
          title: "DMs not supported",
          description: "The `^` member shortcut cannot be used in DMs"
        })
        return
      }
      const messages = Array.from(await getMessages(data.message.channel, { before: data.message.id, limit: 1 }))
      if (messages[0]?.[1].member) {
        return messages[0][1].member
      }
    } catch {}
    let member
    try {
      const id = item.replace(/\D+/g, "")
      if (data.message.guild) {
        member = await getMember(data.message.guild, id)
        if (!member) {
          if (!data.noText) try {
            if (item.startsWith("@")) item = item.slice(1)
            const parts = item.match(/(.+?)(#\d{4}$)?$/)
            const members = await data.message.guild.members.search({ query: parts[1] })
            const found = members.find(member => member.user.username.toLowerCase() === item || member.user.globalName.toLowerCase() === item || member.nickname?.toLowerCase() === item)
            if (found) member = found
          } catch {}
        }
      } else {
        let user
        if (id === client.user.id || item === client.user.username || item === client.user.globalName) {
          user = client.user
        } else if (id === data.message.author.id || item === data.message.author.username) {
          user = data.message.author
        }
        if (user) member = createMember(user)
      }
      if (!member) {
        let user
        try {
          user = await client.users.fetch(id)
        } catch {
          if (!data.noText) {
            const ban = (await data.message.guild.bans.fetch()).find(e => e.user.username.toLowerCase() === item)
            if (ban) user = ban.user
          }
        }
        if (user) member = createMember(user)
      }
    } catch {}
    if (!member && !data.errorless) return sendError(data.message, {
      title: "User not found",
      description: `The user ${limit(item).quote()} was not found`
    })
    return member
  },
  validate(item, data, args) {
    if ((args.guildOnly === true || args.guildOnly === "inGuild" && data.message.guildId) && !item.guild) {
      if (data.errorless) return
      return sendError(data.message, {
        title: `Member unavailable for ${(args.name ?? "member").quote()}`,
        description: `${item} is not in this server`
      })
    }
    if (args.userOnly && item.guild) {
      if (data.errorless) return
      return sendError(data.message, {
        title: `Invalid member for ${(args.name ?? "member").quote()}`,
        description: `${item} is currently in this server`
      })
    }
    if (args.self === false && item.id === data.message.author.id) {
      if (data.errorless) return
      return sendError(data.message, {
        title: `Unsupported member for ${(args.name ?? "member").quote()}`,
        description: "You cannot select yourself"
      })
    }
    if (args.bot === false && item.user.bot) {
      if (data.errorless) return
      return sendError(data.message, {
        title: `Unsupported member for ${(args.name ?? "member").quote()}`,
        description: `${item} is a bot. You cannot select bots.`
      })
    }
    if (item.guild) {
      if (args.aboveSelf === false && !hasPerm(data.message.member, "Administrator") && item.roles.highest.rawPosition >= data.message.member.roles.highest.rawPosition) {
        if (data.errorless) return
        return sendError(data.message, {
          title: `Unsupported member for ${(args.name ?? "member").quote()}`,
          description: `${item} cannot be at or above your highest role level`
        })
      }
      if (args.aboveBot === false && item.roles.highest.rawPosition >= data.message.guild.members.me.roles.highest.rawPosition) {
        if (data.errorless) return
        return sendError(data.message, {
          title: `Unsupported member for ${(args.name ?? "member").quote()}`,
          description: `${item} cannot be at or above ${client.user}'s highest role level`
        })
      }
    }
    return true
  },
  render(details, args) {
    if (args.guildOnly === true || args.guildOnly === "inGuild") {
      details.type = "Server Member"
    } else if (args.userOnly) {
      details["Must not be in the server"] = true
    }
    if (args.self === false) {
      details["Cannot be"] = "Yourself"
    }
    if (args.bot === false) {
      details["Cannot be"] = details["Cannot be"] ? `${details["Cannot be"]}, Bots` : "Bots"
    }
    if (args.aboveSelf === false || args.aboveBot === false) {
      const parts = []
      if (args.aboveSelf === false) parts.push("your highest role")
      if (args.aboveBot === false) parts.push(`${client.user}'s highest role`)
      details["Role requirement"] = `Below ${parts.join(" and ")}`
    }
  }
})
