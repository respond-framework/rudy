export default () => (req, next) => {
  if (!req.route.path) return next()
  if (req.isDoubleDispatch()) return req.handleDoubleDispatch() // don't dispatch the same action twice
  return next()
}
