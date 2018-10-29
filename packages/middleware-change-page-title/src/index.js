import { isServer, createSelector } from '@respond-framework/utils'

export default (options) => {
  const { title } = options || {}
  const selectTitleState = createSelector('title', title)

  return (api) => async (req, next) => {
    const title = selectTitleState(api.getState())

    if (!isServer() && typeof title === 'string') {
      // eslint-disable-next-line no-undef
      window.document.title = title
    }

    return next()
  }
}
