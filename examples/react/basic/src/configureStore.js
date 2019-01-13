import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { createRouter } from '@respond-framework/rudy'

import routes from './routes'
import page from './pageReducer'

export default (preloadedState, initialEntries) => {
  const options = { initialEntries }
  const { reducer, middleware, firstRoute } = createRouter(routes, options)

  const rootReducer = combineReducers({ page, location: reducer })
  const middlewares = applyMiddleware(middleware)
  const enhancers = compose(middlewares)

  const store = createStore(rootReducer, preloadedState, enhancers)

  return { store, firstRoute }
}
