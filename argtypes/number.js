const numRegex = /^-?\d*\.?\d+(?:e[+-]?\d+)?$/

registerArgType(scriptName, {
  get(item, data) {
    if (typeof item === "number") return item
    item = item.replaceAll(",", "").toUpperCase()
    if (item === "Π") return Math.PI
    if (typeof Math[item] === "number") return Math[item]
    if (!numRegex.test(item)) return
    const parsed = parseFloat(item)
    if (!isNaN(parsed)) {
      if (parsed === Infinity || parsed > Number.MAX_SAFE_INTEGER || parsed < Number.MIN_SAFE_INTEGER) {
        if (data.errorless) return
        return sendError(data.message, {
          title: "Unsupported number",
          description: `\`${limit(item)}\` is an unsupported number\n\nNumbers must be between \`${Number.MIN_SAFE_INTEGER.toLocaleString()}\` and \`${Number.MAX_SAFE_INTEGER.toLocaleString()}\``,
          processing: data.processing,
          ephemeral: data.ephemeral
        })
      }
      return parsed
    }
  },
  validate(item, data, args) {
    if (typeof args.min === "number" && item < args.min) {
      if (data.errorless) return
      return sendError(data.message, {
        title: `${args.name.quote()} too small`,
        description: `${item.quote()} is too small. The minimum value is ${args.min.quote()}.`
      })
    }
    if (typeof args.max === "number" && item > args.max) {
      if (data.errorless) return
      return sendError(data.message, {
        title: `${args.name.quote()} too large`,
        description: `${item.quote()} is too large. The maximum value is ${args.max.quote()}.`
      })
    }
    return true
  },
  missing(args) {
    const word = args.type === "integer" ? "an integer" : "a number"
    if (defined(args.min) && defined(args.max)) return `Enter ${word} between ${args.min.toLocaleString()} and ${args.max.toLocaleString()}`
    if (defined(args.min)) return `Enter ${word} above ${args.min.toLocaleString()}`
    if (defined(args.max)) return `Enter ${word} below ${args.max.toLocaleString()}`
  },
  render(details, args) {
    if (defined(args.min) && defined(args.max)) {
      details["Allowed Range"] = `${args.min.toLocaleString()} to ${args.max.toLocaleString()}.`
    } else {
      if (defined(args.min)) {
        details.Minimum = args.min.toLocaleString()
      }
      if (defined(args.max)) {
        details.Maximum = args.max.toLocaleString()
      }
    }
  }
})
