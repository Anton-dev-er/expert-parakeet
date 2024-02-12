const isValidRoomName = (str: string) => {
  // allowed letter, numbers, spaces and '-', '_'
  const re = /^[a-zA-Z\s0-9_-]*$/
  return re.test(str)
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export { isValidRoomName, sleep }
