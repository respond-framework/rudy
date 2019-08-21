# Rudy

Think of your app in terms of _states_, not _routes_ or _components_. Connect
your components and just dispatch _Flux Standard Routing Actions_!

**Rudy** is the successor to
[redux-first-router](https://github.com/faceyspacey/redux-first-router).
Compared to RFR, there are many
[new features, and some breaking changes](https://github.com/respond-framework/rudy/blob/master/packages/rudy/docs/differences-from-rfr.md).
It is a work in progress. The basic features work, but there are still bugs and
some features are incomplete.

## Motivation

Rudy is a library for creating a controller (as in Model View Controller) for
redux based apps. It provides an abstraction for handling all the side effects
and cross cutting concerns that tend to pollute React components and make apps
difficult to understand and work with. Some of the things it can do:

- Maintain a bi-directional mapping between the URL and Redux actions of your
  choice. As far as your app is concerned, URL changes are Redux actions, and
  routing state is Redux state. This mapping works the same way for server side
  and client side rendering.
- Trigger callbacks defined on redux actions (including but not limited to route
  changes), which can do things like making API calls or other side effects.
  They can also delay URL changes until the required data is ready, and/or
  redirect to other routes.
- Set the page title on route changes based on the redux state
- Block page navigation depending on the redux state
- Load code split reducers, controller code, and components for each route when
  necessary.

This library can help you build an app where:

- URLs are defined exclusively in one place
- Code that receives input (and dispatches Redux actions) is decoupled from code
  that triggers side effects (in response to Redux actions).
- The entire app's state can be kept in Redux, and components only need to
  receive state from Redux, not also from other places.
- Components can be pure functions, because they don't have to handle state and
  side effects.
- The majority of the code (reducers, selectors, components) are pure functions
  and can be easily unit tested with no mocking necessary. The little that
  remains (the controller) is neatly concentrated in one place.

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
  const { enhancer, reducer, middleware, firstRoute } = createRouter(routes, options)

  const rootReducer = combineReducers({ page, location: reducer })
  const middlewares = applyMiddleware(middleware)
  const enhancers = compose(enhancer, middlewares)

  const store = enhancers(createStore)(rootReducer, preloadedState)

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

Also see:

- the [boilerplate project](./packages/boilerplate)
- the new but incomplete [documentation](./packages/rudy/docs).
- the outdated [RFR documentation](./packages/rudy/docs-old).

## The Flux Standard Routing Action (FSRA)

The redux actions that Rudy synchronises with URLs have a particular shape and
meaning.

```javascript
const routes = {
  BLOB: {
    path: '/:namespace/:repo/blob/:ref/:path+',
  },
}

const url = {
  url:
    '/respond-framework/rudy/blob/master/README.md?unused=test#the-flux-standard-routing-action-fsra',
  state: {
    invisible: '12345',
  },
}

const action = {
  type: 'BLOB',
  params: {
    namespace: 'respond-framework',
    repo: 'rudy',
    ref: 'master',
    path: 'README.md',
  },
  query: {
    unused: 'test',
  },
  hash: 'the-flux-standard-routing-action-fsra',
  state: {
    invisible: '12345',
  },
}

actionToUrl(action) == { url, state: { invisible: '12345' } }
urlToAction({ url, state: { invisible: '12345' }) == action
```

## Development

Pull requests are welcome! See
[HACKING](https://github.com/respond-framework/rudy/blob/master/HACKING.md) for
some simple instructions for getting started if you want to make an improvement.
More detailed documentation about development is available in the
[development docs](https://github.com/respond-framework/rudy/tree/master/docs/development)
directory.

## License

[MIT](LICENSE)
