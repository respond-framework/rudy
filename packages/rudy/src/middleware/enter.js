import { isServer } from '@respond-framework/utils'
import { redirectShortcut } from '../utils'
import bindUnloadCallback from '../utils/bindUnloadCallback'

export default (api) => async (req, next) => {
  if (req.route.redirect) {
    return redirectShortcut(req)
  }

  // Unregister listeners to browser unload/beforeunload added for the previous route
  if (api.ctx.unbindBeforeUnloadCallback) {
    api.ctx.unbindBeforeUnloadCallback()
    delete api.ctx.unbindBeforeUnloadCallback
  }
  if (api.ctx.unbindOnUnloadCallback) {
    api.ctx.unbindOnUnloadCallback()
    delete api.ctx.unbindOnUnloadCallback
  }

  const res = req.enter() // commit history + action to state

  // Register listeners to browser unload/beforeunload events for the new route
  if (req.route.beforeUnload) {
    api.ctx.unbindBeforeUnloadCallback = bindUnloadCallback(
      api,
      'beforeunload',
      req.route.beforeUnload,
    )
  }
  if (req.route.onUnload) {
    api.ctx.unbindOnUnloadCallback = bindUnloadCallback(
      api,
      'unload',
      req.route.onUnload,
    )
  }

  // return early on `load` so rendering can happen ASAP
  // i.e. before `thunk` is called but after potentially async auth in `beforeEnter`
  if (req.getKind() === 'load' && !isServer() && api.resolveFirstRouteOnEnter) {
    setTimeout(() => {
      next().then(() => {
        req.ctx.busy = false
      })
    }, 0) // insure callbacks like `onEnter` are called after `ReactDOM.render`, which should immediately be called after dispatching `firstRoute()`

    // in `createRouter.js` this flag will indicate to keep the pipeline still "busy" so
    // that dispatches in `thunk` and other callbacks after `enter` are treated as redirects,
    // as automatically happens throughout the pipeline. It becomes unbusy in the timeout above.
    req.clientLoadBusy = true
    return res
  }

  return res.then(next).then(() => res)
}
