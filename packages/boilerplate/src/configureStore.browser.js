/* eslint-env browser */

import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction'
import {
  push,
  replace,
  jump,
  back,
  next,
  reset,
  set,
  setParams,
  setQuery,
  setState,
  setHash,
  setBasename,
  createRouter,
  call,
  transformAction,
  pathlessRoute,
  enter,
  serverRedirect,
  anonymousThunk,
  changePageTitle,
} from '@respond-framework/rudy'

import { isServer } from '@respond-framework/utils'

import routes from './routes'
import * as reducers from './reducers'

export default (preloadedState, initialEntries) => {
  const options = { initialEntries, basenames: ['/foo', '/bar'] }
  const { reducer, middleware, firstRoute, api } = createRouter(
    routes,
    options,
    [
      serverRedirect, // short-circuiting middleware
      anonymousThunk,
      pathlessRoute('thunk'),
      transformAction, // pipeline starts here
      // Hydrate: skip callbacks called on server to produce initialState (beforeEnter, thunk, etc)
      // Server: don't allow client-centric callbacks (onEnter, onLeave, beforeLeave)
      call('beforeLeave', { prev: true }),
      call('beforeEnter', { runOnServer: true }),
      enter,
      changePageTitle({ title: options.title }),
      () => (request, nextMiddleware) =>
        nextMiddleware().then(async () => {
          const {
            action: {
              hash,
              location: { kind },
            },
          } = request
          if (
            isServer() ||
            kind === 'load' ||
            kind === 'back' ||
            kind === 'next'
          ) {
            return
          }
          if (hash) {
            const element = document.getElementById(hash)
            console.log(`SCROLLING TO #${hash}`)
            if (element) {
              element.scrollIntoView()
            }
          }
        }),
      call('onLeave', { prev: true }),
      call('onEnter', { runOnHydrate: true }),
      call('thunk', { cache: true, runOnServer: true }),
      call('onComplete', { runOnServer: true }),
    ],
  )
  const { history, ctx } = api

  const rootReducer = combineReducers({ ...reducers, location: reducer })
  const middlewares = applyMiddleware(middleware)
  const enhancers = composeEnhancers(middlewares)
  const store = createStore(rootReducer, preloadedState, enhancers)

  if (module.hot) {
    module.hot.accept('./reducers/index', () => {
      const newRootReducer = combineReducers({ ...reducers, location: reducer })
      store.replaceReducer(newRootReducer)
    })
  }

  if (typeof window !== 'undefined') {
    window.routes = routes
    window.store = store
    window.hist = history
    window.actions = actionCreators
    window.ctx = ctx
  }

  return { store, firstRoute, api }
}

const composeEnhancers = (...args) =>
  typeof window !== 'undefined'
    ? composeWithDevTools({ actionCreators })(...args)
    : compose(...args)

const actionCreators = {
  push,
  replace,
  jump,
  back,
  next,
  reset,
  set,
  setParams,
  setQuery,
  setState,
  setHash,
  setBasename,
}
