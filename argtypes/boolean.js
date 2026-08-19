// accepts yes/no, true/false, on/off, 1/0, and friends
registerArgType(scriptName, {
  get(item) {
    if (item === true || item === false) return item
    if (item.match(/^(1|0|true|false|on|off|yes|no|y|n|yeah|nah)$/i)) {
      return !item.match(/^(0|false|off|no|n|nah)$/i)
    }
  },
  missing: () => "Enter `yes` or `no`"
})
