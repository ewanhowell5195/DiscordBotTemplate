// a shared autocomplete, referenced from arguments as autocomplete: "dice"
registerAutocomplete(scriptName, (interaction, text) => {
  interaction.respond([4, 6, 8, 10, 12, 20, 100].filter(e => e.toString().includes(text)).map(e => ({ name: `D${e}`, value: e })))
})
