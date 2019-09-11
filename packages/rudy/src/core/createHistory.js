// @flow
import BrowserHistory from '../history/BrowserHistory'
import MemoryHistory from '../history/MemoryHistory'
import { supportsDom } from '../history/utils'
import type { Routes, Options } from '../flow-types'

export default (routes: Routes, opts: Options = {}) =>
  supportsDom() && opts.testBrowser !== false
    ? new BrowserHistory(routes, opts)
    : new MemoryHistory(routes, opts)
