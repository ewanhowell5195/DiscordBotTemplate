registerPrefixCommand(scriptName, prefixPath, {
  description: "Turn a message into a text file.",
  arguments: [{
    name: "message",
    description: "The message to turn into a file",
    required: true
  }],
  execute: (message, content) => sendFile(message, {
    name: "message.txt",
    buffer: Buffer.from(content, "utf8")
  })
})