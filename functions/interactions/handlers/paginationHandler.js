// sends a paginated container with navigation buttons and a page select modal. pages can be
// strings, container content arrays, message shorthand objects, or functions returning any of
// those for lazy loading. args.selector = { name, items, find } adds a named lookup to the page
// select modal (find(input) returns the page index)
registerFunction(scriptName, async (message, pages, args) => {
  let index = args?.index ?? 0
  async function getPage(index) {
    let page = pages[index]
    if (typeof page === "function") page = await page()
    const contents = []
    if (typeof page === "string") {
      contents.push(page)
    } else if (Array.isArray(page)) {
      contents.push(...page)
    } else {
      const parts = []
      if (page.title) parts.push(`## ${page.title}`)
      if (page.description) parts.push(page.description)
      contents.push(parts.join("\n"))
      if (page.fields) {
        for (const field of page.fields) {
          contents.push(`### ${field[0]}\n${field[1]}`)
        }
      }
      if (page.image) contents.push(component.media(page.image))
    }
    contents.push(
      `-# Page ${(index + 1).toLocaleString()} of ${pages.length.toLocaleString()}`,
      component.row(
        component.button({
          id: "prevend",
          emoji: client.emotes.arrowLeftEndWhite,
          disabled: !index
        }),
        component.button({
          id: "prev",
          emoji: client.emotes.arrowLeftWhite,
          disabled: !index
        }),
        component.button({
          id: "modal",
          emoji: client.emotes.textCursorWhite
        }),
        component.button({
          id: "next",
          emoji: client.emotes.arrowRightWhite,
          disabled: index === pages.length - 1
        }),
        component.button({
          id: "nextend",
          emoji: client.emotes.arrowRightEndWhite,
          disabled: index === pages.length - 1
        })
      )
    )
    return [component.container(message, contents)]
  }
  const paginator = await sendMessage(message, {
    components: await getPage(index),
    processing: args?.processing,
    ephemeral: args?.ephemeral
  })
  await interactionHandler(paginator, async interaction => {
    if (interaction.customId === "modal") {
      return interaction.showModal(component.modal("Select Page", [
        component.textInput({
          id: "page",
          label: `Page Number${args?.selector ? ` or ${args?.selector.name}` : ""}`,
          description: `Select the Page Number${args?.selector ? ` or ${args?.selector.name}` : ""} to go to. There are ${pages.length.toLocaleString()} pages available`,
          placeholder: `Page Number${args?.selector ? ` / ${args?.selector.name}` : ""}`,
          required: true
        }),
        args?.selector?.items ? component.text(`\n\n### ${args?.selector.name}s:\n${quoteList(args?.selector.items)}`) : undefined
      ].filter(Boolean), "custom"))
    }
    if (interaction.customId === "prevend") {
      index = 0
    } else if (interaction.customId === "prev") {
      index--
    } else if (interaction.customId === "next") {
      index++
    } else if (interaction.customId === "nextend") {
      index = pages.length - 1
    } else if (interaction.customId === "custom") {
      const input = interaction.fields.getTextInputValue("page")
      let passed
      if (input.match(/^[\d,]+$/)) {
        const num = parseInt(input.replaceAll(",", ""))
        if (num > 0 && num <= pages.length) {
          index = num - 1
          passed = true
        }
      }
      if (!passed && args?.selector) {
        const result = args?.selector.find(input)
        if (defined(result) && result !== -1) {
          index = result
          passed = true
        }
      }
      if (!passed) {
        return sendPrivateError(interaction, {
          title: "Page not found",
          description: `Page ${limit(input).quote()} was not found`
        })
      }
    }
    interaction.deferUpdate()
    ;(args?.ephemeral ? editPrivateMessage : editMessage)(paginator, {
      components: await getPage(index)
    })
  }, {
    author: message.author
  })
})