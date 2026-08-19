globalThis.prepareDBAction = (action, run = "run", input = null, output = null) => {
  const prep = database.prepare(action)
  if (output) return (...args) => {
    if (input) args = input(...args)
    return output(prep[run](...args))
  }
  else return (...args) => {
    if (input) args = input(...args)
    return prep[run](...args)
  }
}

database.pragma("journal_mode = WAL")

export default {
  notes: (await import("./sql/notes.js")).default
}