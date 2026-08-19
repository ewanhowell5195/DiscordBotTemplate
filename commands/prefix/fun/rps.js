// demonstrates the choose prompt
const options = ["Rock", "Paper", "Scissors"]

registerPrefixCommand(scriptName, prefixPath, {
  description: "Play rock paper scissors against the bot.",
  aliases: ["rockpaperscissors"],
  async execute(message) {
    const choice = await choose(message, {
      title: "Rock Paper Scissors",
      description: "Pick your move!",
      options
    })
    if (!choice[0]) return
    const player = parseInt(choice[0])
    const bot = randInt(2)
    const result = player === bot ? "It's a draw!" : (player + 1) % 3 === bot ? "I win!" : "You win!"
    sendMessage(message, {
      title: result,
      description: `You picked **${options[player]}**, and I picked **${options[bot]}**`
    }, choice[1])
  }
})