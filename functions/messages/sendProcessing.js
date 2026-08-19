// shows a processing state for slow commands, pass the result as processing: to a later send to replace it
registerFunction(scriptName, async (message, processing, args = {}) => {
  if (processing) return processing
  if (message.command.application) return await message.deferReply({ ephemeral: args.ephemeral })
  const msg = await sendMessage(message, {
    title: "Processing...",
    thumbnail: client.icons.pinging,
    processing
  })
  return msg ?? true
})