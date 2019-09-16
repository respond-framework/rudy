// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (name: string, selector?: string | Function): any => {
  if (typeof selector === 'function') {
    return selector
  }
  if (selector) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (state: { [index: string]: any }): any =>
      state ? state[selector] : undefined
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (state: { [index: string]: any }): any =>
    state ? state[name] : undefined
}
