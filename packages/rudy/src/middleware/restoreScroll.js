export default (api) => {
  const { scrollRestorer } = api
  if (scrollRestorer) {
    return scrollRestorer.restoreScroll(api)
  }
  return (_, next) => next()
}
