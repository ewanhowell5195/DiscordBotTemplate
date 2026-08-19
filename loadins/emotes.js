const fallbacks = {
  tickWhite: "✅",
  crossWhite: "❌",
  binWhite: "🗑️",
  pencilWhite: "✏️",
  questionWhite: "❓",
  arrowLeftWhite: "⬅️",
  arrowRightWhite: "➡️",
  arrowLeftEndWhite: "⏮️",
  arrowRightEndWhite: "⏭️",
  textCursorWhite: "#️⃣",
  missingPermissions: "🚫",
  success: "✅"
}

registerLoadIn(scriptName, {
  async load() {
    client.emotes = {}
    const emojis = await client.application.emojis.fetch()
    for (const emoji of emojis) {
      client.emotes[emoji[1].name.replace(/(_\w)/g, match => match[1].toUpperCase())] = emoji[1].id
    }
    // unicode fallbacks for names without a matching application emoji
    for (const [name, emoji] of Object.entries(fallbacks)) {
      client.emotes[name] ??= emoji
    }
  },
  unload: () => delete client.emotes
})