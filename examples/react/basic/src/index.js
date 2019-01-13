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
