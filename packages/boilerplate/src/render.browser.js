/* eslint-env browser */

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { LinkContext } from '@respond-framework/link'
import App from './components/App'
import configureStore from './configureStore'

const { store, firstRoute, api } = configureStore(window.REDUX_STATE)

const root = document.getElementById('root')

const render = () =>
  ReactDOM.hydrate(
    <Provider store={store}>
      <LinkContext.Provider value={api}>
        <App />
      </LinkContext.Provider>
    </Provider>,
    root,
  )

store.dispatch(firstRoute()).then(() => {
  render()
})

if (module.hot) {
  module.hot.accept('./components/App', render)
}
