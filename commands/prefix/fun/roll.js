// demonstrates a number argument with an autocomplete from the autocompletes folder
registerPrefixCommand(scriptName, prefixPath, {
  description: "Roll a dice.",
  aliases: ["dice"],
  arguments: [{
    type: "number",
    name: "sides",
    description: "The number of sides on the dice",
    default: 6,
    autocomplete: "dice"
  }],
  execute(message, sides) {
    sides = Math.max(2, Math.floor(sides))
    return sendMessage(message, `🎲 You rolled a **${randInt(sides - 1) + 1}** on a D${sides}`)
  }
})