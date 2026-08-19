// image urls usable as thumbnails and section accessories
registerLoadIn(scriptName, {
  load() {
    client.icons = {
      pinging: "https://wynem.com/assets/images/icons/pinging.gif"
    }
  },
  unload: () => delete client.icons
})