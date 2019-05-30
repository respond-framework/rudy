// @flow
import { isServer } from '@respond-framework/utils'
import type { LocationState } from '../../../flow-types'
import { isHydrate } from '../../../utils'

export default (name, route, req, { runOnServer, runOnHydrate }) => {
  if (!route[name] && !req.options[name]) return false

  if (isHydrate(req) && !runOnHydrate) return false

  if (isServer() && !runOnServer) return false

  return allowBoth
}

const allowBoth = { route: true, options: true }

// If for instance, you wanted to allow each route to decide
// whether to skip options callbacks, here's a simple way to do it:
//
// return {
//   options: !route.skipOpts, // if true, don't make those calls
//   route: true
// }
//
// You also could choose to automatically trigger option callbacks only as a fallback:
//
// return {
//   options: !route[name],
//   route: !!route[name]
// }
