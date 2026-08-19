// a png avatar url for a member or user, with a default avatar fallback
registerFunction(scriptName, (member, size = 1024, args) => {
  if (!member) return `https://cdn.discordapp.com/embed/avatars/${randInt(5)}.png`
  let url = member.displayAvatarURL({
    extension: getType.image("PNG"),
    forceStatic: args?.static
  })
  if (size) url += `?size=${size}`
  return url
})