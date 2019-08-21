import React from 'react'
import renderer from 'react-test-renderer'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'

import { createRouter } from '@respond-framework/rudy'

import { Link, NavLink } from '@respond-framework/react'

const createLink = async (props, initialPath, options, isNavLink) => {
  const link = isNavLink ? <NavLink {...props} /> : <Link {...props} />

  const routes = {
    FIRST: '/first',
    SECOND: '/second/:param',
    THIRD: '/third',
  }

  const { enhancer, middleware, reducer, firstRoute } = createRouter(routes, {
    initialEntries: initialPath || '/',
    ...options,
  })

  const rootReducer = (state = {}, action = {}) => ({
    location: reducer(state.location, action),
  })

  const store = compose(
    enhancer,
    applyMiddleware(middleware),
  )(createStore)(rootReducer)
  await store.dispatch(firstRoute())

  const component = renderer.create(<Provider store={store}>{link}</Provider>)

  return {
    component,
    tree: component.toJSON(),
    store,
  }
}

export default createLink
export const createNavLink = (path, props, options) =>
  createLink(props, path, options, true)

export const event = { preventDefault: () => undefined, button: 0 }
