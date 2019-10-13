import { History } from '@respond-framework/rudy'
import createTest from '../../__helpers__/createTest'

createTest(
  'History class can be used directly',
  {
    FIRST: '/',
    SECOND: '/second',
  },
  {
    createHistory: (routes, options) => new History(routes, options),
  },
)
