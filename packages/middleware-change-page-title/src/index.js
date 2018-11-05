import {
  isServer as defaultIsServer,
  createSelector as defaultCreateSelector,
} from '@respond-framework/utils'

export default (options) => {
  const {
    title: keyOrSelector,
    isServer = defaultIsServer,
    createSelector = defaultCreateSelector,
    setTitle = (title) => {
      // eslint-disable-next-line no-undef
      window.document.title = title
    },
  } = options || {}
  const selectTitleState = createSelector('title', keyOrSelector)

  return (api) => async (req, next) => {
    const title = selectTitleState(api.getState())

    if (!isServer() && typeof title === 'string') {
      // eslint-disable-next-line no-undef
      setTitle(title)
    }

    return next()
  }
}
