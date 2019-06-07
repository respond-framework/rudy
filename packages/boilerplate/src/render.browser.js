/* eslint-env browser */

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { RudyProvider } from '@respond-framework/react'
import App from './components/App'
import configureStore from './configureStore'

const { store, firstRoute, api } = configureStore(window.REDUX_STATE)

const root = document.getElementById('root')

const render = () =>
  ReactDOM.hydrate(
    <Provider store={store}>
      <RudyProvider api={api}>
        <App />
      </RudyProvider>
    </Provider>,
    root,
  )

store.dispatch(firstRoute()).then(() => {
  render()
})

if (module.hot) {
  module.hot.accept('./components/App', render)
}
