registerPrefixCommand(scriptName, prefixPath, {
  description: "Check what the bot's latency is.",
  aliases: ["pong"],
  async execute(message) {
    const before = Date.now()
    const ping = await sendMessage(message, {
      title: "Pinging...",
      thumbnail: client.icons.pinging,
      fields: [
        ["API latency", client.ws.ping === -1 ? "Not calculated yet" : `${Math.round(client.ws.ping)} ms`]
      ]
    })
    editMessage(ping, {
      title: "Pong",
      fields: [
        ["API latency", client.ws.ping === -1 ? "Not calculated yet" : `${Math.round(client.ws.ping)} ms`],
        ["Bot latency", `${Date.now() - before} ms`]
      ]
    })
  }
})