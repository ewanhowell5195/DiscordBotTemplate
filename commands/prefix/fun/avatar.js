registerPrefixCommand(scriptName, prefixPath, {
  description: "View a member's avatar.",
  aliases: ["av", "pfp"],
  arguments: [{
    type: "member",
    name: "member",
    description: "The member to view the avatar of"
  }],
  execute(message, member) {
    member ??= message.member
    return sendMessage(message, {
      title: `${member.displayName}'s avatar`,
      image: avatar(member, 4096)
    })
  }
})