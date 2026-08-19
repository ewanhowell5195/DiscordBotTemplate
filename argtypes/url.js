// prepends https:// when missing. exists: true also checks the url responds
const start = /^https?:\/\//

registerArgType(scriptName, async (item, data, args) => {
  item = item.replace(/^<|>$/g, "")
  if (!start.test(item)) {
    item = "https://" + item
  }
  if (urlTest.test(item)) {
    if (!args.exists) return item
    try {
      const r = await fetch(item, { method: "HEAD" })
      if (r.status < 400) {
        const url = new String(item)
        url.request = r
        return url
      }
      if (!data?.errorless) return sendError(data.message, {
        title: "Unable to get URL",
        description: `The URL returned an error code: \`${r.status}\``
      })
    } catch {
      if (!data?.errorless) return sendError(data.message, {
        title: "Unable to get URL",
        description: "The URL did not respond"
      })
    }
  }
})
