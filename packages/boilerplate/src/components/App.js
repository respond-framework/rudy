import React from 'react'
import {hot} from 'react-hot-loader'

import Sidebar from './Sidebar'
import Switcher from './Switcher'
import {ConnectedRouter, Route} from '../router'
import {store} from '../configureStore.browser'
import styles from '../css/App.css'
import * as Rudy from "@respond-framework/rudy";


console.log(store);
console.log(Rudy);

// Rudy.addRoutes({
//   path: '/test',
//   component: () => import('./Test')
//   onEnter: () => {
//     console.log('ENTERING')
//   },
//   beforeEnter: async (req) => {
//     // eslint-disable-next-line no-undef
//     if (typeof window !== 'undefined' && window.foo) {
//       await new Promise((res) => setTimeout(res, 3000))
//     }
//
//     // eslint-disable-next-line no-undef
//     if (typeof window !== 'undefined' && window.foo) {
//       await req.dispatch({
//         type: 'LIST',
//         params: {category: 'react'},
//       })
//     }
//   }
// })

class App extends React.Component {
  componentDidMount() {
    console.log('DidMount')
  }

  render() {
    return (
      <div className={styles.app}>
        <Sidebar/>
        <ConnectedRouter>
          <Route
            path="/test"
            component={() => import('./Test')}
            onEnter={() => {
              console.log('ENTERING')
            }}
            beforeEnter={async (req) => {
              // eslint-disable-next-line no-undef
              if (typeof window !== 'undefined' && window.foo) {
                await new Promise((res) => setTimeout(res, 3000))
              }

              // eslint-disable-next-line no-undef
              if (typeof window !== 'undefined' && window.foo) {
                await req.dispatch({
                  type: 'LIST',
                  params: {category: 'react'},
                })
              }
            }}
          />
        </ConnectedRouter>
        <Switcher/>
      </div>
    )
  }
}

export default hot(module)(App)
