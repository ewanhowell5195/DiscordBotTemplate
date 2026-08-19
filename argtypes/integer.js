// a number that must be whole
registerArgType(scriptName, {
  get(item, data, args) {
    item = argTypes.number.get(item, data, args)
    if (typeof item === "number" && item % 1 !== 0) {
      if (data.errorless) return
      return sendError(data.message, {
        title: `Invalid integer for ${args.name.quote()}`,
        description: `${item.quote()} is not a valid integer. Integers are whole numbers.`,
        processing: data.processing,
        ephemeral: data.ephemeral
      })
    }
    return item
  },
  validate(item, data, args) {
    return argTypes.number.validate(item, data, args)
  },
  missing: (args, message) => argTypes.number.missing(args, message),
  render: (details, args) => argTypes.number.renderDetails(details, args)
})
