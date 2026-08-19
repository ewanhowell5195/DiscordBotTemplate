registerPrefixCommand(scriptName, prefixPath, {
  description: "Get some information about the bot.",
  aliases: ["botinformation", "botinfo", "information", "binfo", "about"],
  async execute(message) {
    const creator = await client.users.fetch(config.owners[0])
    sendMessage(message, {
      title: client.user.displayName,
      description: "A Discord bot",
      thumbnail: avatar(client.user),
      image: client.user.bannerURL({
        extension: getType.image("PNG"),
        size: 4096
      }),
      fields: [
        ["Prefix", config.prefix],
        ["Uptime", client.totalUptime],
        ["Command count", client.stats.prefixCommandCount.toLocaleString()],
        ["Library", `[discord.js v${Discord.version}](https://github.com/discordjs/discord.js/releases/tag/${Discord.version})`]
      ],
      footer: `Created by ${creator.username}`
    })
  }
})