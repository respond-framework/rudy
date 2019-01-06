// @flow
import qs from 'qs'
import { createSelector } from '@respond-framework/utils'
import type {
  InputOptions,
  Options,
  Store,
  Dispatch,
  RoutesInput,
} from '../flow-types'
import {
  compose as defaultCompose,
  createHistory as defaultCreateHistory,
  createReducer as defaultCreateReducer,
  createInitialState as defaultCreateInitialState,
  createRequest as defaultCreateRequest,
} from './index'

import {
  formatRoutes,
  shouldTransition as defaultShouldTransition,
  parseSearch as defaultParseSearch,
  onError as defaultOnError,
} from '../utils'

import {
  serverRedirect,
  pathlessRoute,
  anonymousThunk,
  transformAction,
  call,
  enter,
  changePageTitle,
} from '../middleware'

export default (
  routesInput: RoutesInput = {},
  inputOptions: InputOptions = {},
  middlewares: Array<Function> = [
    serverRedirect, // short-circuiting middleware
    anonymousThunk,
    pathlessRoute('thunk'),
    transformAction, // pipeline starts here
    call('beforeLeave', { prev: true }),
    call('beforeEnter'),
    enter,
    changePageTitle(),
    call('onLeave', { prev: true }),
    call('onEnter'),
    call('thunk', { cache: true }),
    call('onComplete'),
  ],
) => {
  // assign to options so middleware can override them in 1st pass if necessary
  const options: Options = {
    ...inputOptions,

    // Fill in the optional values with defaults
    shouldTransition: inputOptions.shouldTransition || defaultShouldTransition,
    createRequest: inputOptions.createRequest || defaultCreateRequest,
    compose: inputOptions.compose || defaultCompose,
    onError: inputOptions.onError || defaultOnError,
    parseSearch: inputOptions.parseSearch || defaultParseSearch,
    stringifyQuery: inputOptions.stringifyQuery || qs.stringify,
    createHistory: inputOptions.createHistory || defaultCreateHistory,
    createReducer: inputOptions.createReducer || defaultCreateReducer,
    createInitialState:
      inputOptions.createInitialState || defaultCreateInitialState,
  }

  const {
    location,
    formatRoute,
    createHistory,
    createReducer,
    createInitialState,
  } = options

  const routes = formatRoutes(routesInput, formatRoute)
  const selectLocationState = createSelector('location', location)
  const history = createHistory(routes, options)
  const { firstAction } = history
  const initialState = createInitialState(firstAction)
  const reducer = createReducer(initialState, routes)
  const wares = {}
  const register = (name: string, val?: any = true) => (wares[name] = val)
  const has = (name: string) => wares[name]
  const ctx = { busy: false }
  const api = { routes, history, options, register, has, ctx }
  const onError = call('onError')(api)
  const nextPromise = options.compose(
    middlewares,
    api,
    true,
  )

  const middleware = ({ dispatch, getState }: Store) => {
    const getLocation = (s) => selectLocationState(s || getState() || {})
    const { shouldTransition, createRequest } = options // middlewares may mutably monkey-patch these in above call to `compose`

    // TODO: Fix these annotations
    Object.assign(api, { getLocation, dispatch, getState })

    getState.rudy = api // make rudy available via `context` with no extra Providers, (see <Link />)
    history.listen(dispatch, getLocation) // dispatch actions in response to pops, use redux location state as single source of truth

    return (dispatch: Dispatch) => (action: Object): Promise<any> => {
      if (!shouldTransition(action, api)) return dispatch(action) // short-circuit and pass through Redux middleware normally
      if (action.tmp && action.tmp.canceled) return Promise.resolve(action)

      const req = createRequest(action, api, dispatch) // the `Request` arg passed to all middleware
      const mw = req.route.middleware
      const next = mw
        ? options.compose(
            mw,
            api,
            !!req.route.path,
          )
        : nextPromise

      return next(req) // start middleware pipeline
        .catch((error) => {
          if (options.wallabyErrors) throw error // wallaby UI is linkable if we don't re-throw errors (we'll see errors for the few tests of errors outside of wallaby)
          req.error = error
          req.errorType = `${req.action.type}_ERROR`
          return onError(req)
        })
        .then((res) => {
          const { route, tmp, ctx, clientLoadBusy } = req
          const isRoutePipeline = route.path && !tmp.canceled && !clientLoadBusy
          ctx.busy = isRoutePipeline ? false : ctx.busy
          return res
        })
    }
  }

  return {
    ...api,
    middleware,
    reducer,
    firstRoute: (resolveOnEnter = true) => {
      api.resolveFirstRouteOnEnter = resolveOnEnter
      return firstAction
    },
  }
}
