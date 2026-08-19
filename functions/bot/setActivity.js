// the bot status, refreshed every 30 minutes as discord clears custom statuses
registerFunction(scriptName, () => {
  client.user.setActivity("Use /help to view commands!", { type: Discord.ActivityType.Custom })
  setTimeout(setActivity, 1800000)
})