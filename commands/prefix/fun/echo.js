registerPrefixCommand(scriptName, prefixPath, {
  description: "Echo a message.",
  arguments: [{
    name: "message",
    description: "The message to echo",
    maxLength: 128,
    default: "You forgot the message"
  }],
  execute: (message, content) => sendMessage(message, { content })
})