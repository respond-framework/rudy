# Respond Framework

Think of your app in terms of _states_, not _routes_ or _components_. Connect
your components and just dispatch _Flux Standard Actions_!

**Rudy** is the successor to
[redux-first-router](https://github.com/faceyspacey/redux-first-router).

## Motivation

To be able to use Redux _as is_ while keeping the address bar in sync. To
achieve _bi-directional mapping_ between the address bar and Redux actions. This
way, changing the address (also via back/forward) dispatches an action, and
dispatching an action changes the address. Paths are defined as actions, and
path params and query strings are handled as action payloads.

**Respond Framework** also seeks to _avoid_ the following obstacles:

- Rendering from state that doesn't come from Redux
- Dealing with the added complexity from having state outside of Redux
- Cluttering components with route-related code
- Large API surface areas of frameworks like `react-router` and `next.js`
- Routing frameworks getting in the way of optimizing animations (such as when
  animations coincide with component updates)
- Having to do route changes differently in order to support server-side
  rendering

## Usage

### Install

`yarn add @respond-framework/rudy`

### Basic example for React

```js
// index.js
// The entrypoint is mostly standard react-redux, just note the call to configureStore() and the last line.

import React from 'react'
import { connect, Provider } from 'react-redux'
import ReactDOM from 'react-dom'

import configureStore from './configureStore'
import * as components from './components'

// App component
const App = ({ page }) => {
  const Component = components[page]
  return <Component />
}
const ConnectedApp = connect(({ page }) => ({ page }))(App)

// Redux setup
const { store, firstRoute } = configureStore()

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedApp />
    </Provider>,
    document.getElementById('root'),
  )
}

store.dispatch(firstRoute()).then(() => render())
```

```js
// routes.js
// Routes are centrally defined along with their paths, along with much more that is not shown here for simplicity.

export default {
  HOME: '/',
  USER: '/user/:id',
}
```

```js
// pageReducer.js
// A simple reducer maps path actions to component names. This makes it easy to dynamically import pages!

const components = {
  HOME: 'Home',
  USER: 'User',
  NOT_FOUND: 'NotFound',
}

export default (state = 'Home', action = {}) => components[action.type] || state
```

```js
// configureStore.js
// Configures the router and inserts it into the Redux store.
// Both arguments in the exported function are optional.

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
```

```js
// components.js
// A few trivial components which can now access location and any params through Redux!

import React from 'react'
import { connect } from 'react-redux'

// Home component
const Home = ({ visitUser }) => {
  const rndUserId = Math.floor(20 * Math.random())
  return (
    <div>
      <p>Welcome home!</p>
      <button type="button" onClick={() => visitUser(rndUserId)}>
        {`Visit user ${rndUserId}`}
      </button>
    </div>
  )
}

const ConnectedHome = connect(
  null,
  (dispatch) => ({
    visitUser: (userId) => dispatch({ type: 'USER', params: { id: userId } }),
  }),
)(Home)

// User component
const User = ({ goHome, userId }) => (
  <div>
    <p>{`User component: user ${userId}`}</p>
    <button type="button" onClick={() => goHome()}>
      Back
    </button>
  </div>
)

const ConnectedUser = connect(
  ({ location: { params } }) => ({ userId: params.id }),
  (dispatch) => ({ goHome: () => dispatch({ type: 'HOME' }) }),
)(User)

// 404 component
const NotFound = ({ pathname }) => (
  <div>
    <h3>404</h3>
    Page not found: <code>{pathname}</code>
  </div>
)
const ConnectedNotFound = connect(({ location: { pathname } }) => ({
  pathname,
}))(NotFound)

export {
  ConnectedHome as Home,
  ConnectedUser as User,
  ConnectedNotFound as NotFound,
}
```

The source code for this example can be found [here](./examples/react).

Also see the [boilerplate project](./packages/boilerplate) and the (partly
outdated) [documentation](./packages/rudy/docs).

## License

[MIT](LICENSE)
