import React from 'react'
import { hot } from 'react-hot-loader'
import * as Rudy from '@respond-framework/rudy'

import Sidebar from './Sidebar'
import Switcher from './Switcher'
import styles from '../css/App.css'

Rudy.nestedRoute.add({
  TEST: {
    path: '/test',
    component: () => import('./Test'),
    onEnter: () => {
      console.log('ENTERING')
    },
    beforeEnter: async (req) => {
      // eslint-disable-next-line no-undef
      if (typeof window !== 'undefined' && window.foo) {
        await new Promise((res) => setTimeout(res, 3000))
      }

      // eslint-disable-next-line no-undef
      if (typeof window !== 'undefined' && window.foo) {
        await req.dispatch({
          type: 'LIST',
          params: { category: 'react' },
        })
      }
    },
  },
})

class App extends React.Component {
  componentDidMount() {
    console.log('DidMount')
  }

  render() {
    return (
      <div className={styles.app}>
        <Sidebar />
        <Switcher />
      </div>
    )
  }
}

export default hot(module)(App)

// TODO: Create a JSX router (next phase after nested routes
// should look like this

// import {ConnectedRouter, Route} from '../router'
//         <ConnectedRouter>
//           <Route
//             path="/test"
//             component={() => import('./Test')}
//             onEnter={() => {
//               console.log('ENTERING')
//             }}
//             beforeEnter={async (req) => {
//               // eslint-disable-next-line no-undef
//               if (typeof window !== 'undefined' && window.foo) {
//                 await new Promise((res) => setTimeout(res, 3000))
//               }
//
//               // eslint-disable-next-line no-undef
//               if (typeof window !== 'undefined' && window.foo) {
//                 await req.dispatch({
//                   type: 'LIST',
//                   params: {category: 'react'},
//                 })
//               }
//             }}
//           />
//         </ConnectedRouter>
