// whether a member has any of the permissions in client.modPermissions
registerFunction(scriptName, member => {
  try {
    return client.modPermissions.some(e => hasPerm(member, e))
  } catch {}
})