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
} from '@respond-framework/rudy'

import routes from './routes'
import * as reducers from './reducers'

export default (preloadedState, initialEntries) => {
  const options = { initialEntries, basenames: ['/foo', '/bar'] }
  const { enhancer, reducer, middleware, firstRoute, api } = createRouter(
    routes,
    options,
  )
  const { history, ctx } = api

  const rootReducer = combineReducers({ ...reducers, location: reducer })
  const enhancers = composeEnhancers(enhancer, applyMiddleware(middleware))
  const store = enhancers(createStore)(rootReducer, preloadedState)

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
