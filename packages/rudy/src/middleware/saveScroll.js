export default (api) => {
  const { scrollRestorer } = api
  if (scrollRestorer) {
    return scrollRestorer.saveScroll(api)
  }
  return (_, next) => next()
}
