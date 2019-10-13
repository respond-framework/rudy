import {
  compose,
  createHistory,
  createRequest,
  createReducer,
  shouldTransition,
  shouldCall,
} from '@respond-framework/rudy'
import createTest from '../../__helpers__/createTest'

createTest(
  'core capabilities can be overriden as options',
  {
    SECOND: {
      path: '/second',
      thunk() {},
    },
  },
  {
    createHistory: (...args) => createHistory(...args),
    createReducer: (...args) => createReducer(...args),
    compose: (...args) => compose(...args),
    shouldTransition: (...args) => shouldTransition(...args),
    createRequest: (...args) => createRequest(...args),
    shouldCall: (...args) => shouldCall(...args),
    location: 'location',
  },
)
