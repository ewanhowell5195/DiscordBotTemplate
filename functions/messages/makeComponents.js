// normalises message args into components v2. args can be a string, an array of container
// contents, a builder, or an object with either top level components or the embed style
// shorthand: { title, url, description, fields, image, thumbnail, footer, button, colour }
registerFunction(scriptName, (message, args) => {
  if (typeof args === "string" || Array.isArray(args)) {
    args = { components: [component.container(message, [].concat(args))] }
  } else if (Object.getPrototypeOf(args) !== Object.prototype) {
    if (args instanceof Discord.ContainerBuilder) {
      args = { components: [args] }
    } else {
      args = { components: [component.container(message, [args])] }
    }
  }
  if (!args.components) {
    const components = []
    const parts = []
    if (args.title) {
      if (args.url) {
        parts.push(`## [${args.title}](${args.url})`)
      } else {
        parts.push(`## ${args.title}`)
      }
    }
    if (args.description) {
      parts.push(args.description)
    }
    if (args.thumbnail) {
      components.push(component.section(parts, component.thumbnail(args.thumbnail)))
    } else {
      components.push(parts.join("\n"))
    }
    if (args.fields) {
      for (const field of args.fields) {
        components.push(`### ${field[0]}\n${field[1]}`)
      }
    }
    if (args.image) {
      components.push(component.media(args.image))
    }
    if (args.footer) {
      if (args.button) {
        components.push(component.section(`-# ${args.footer}`, component.button(args.button)))
      } else {
        components.push(`-# ${args.footer}`)
      }
    } else if (args.button) {
      components.push(component.button(args.button))
    }
    args.components = [component.container(message, {
      colour: args.colour,
      components
    })]
  }
  args.flags = getFlag.message("IsComponentsV2")
  return args
})