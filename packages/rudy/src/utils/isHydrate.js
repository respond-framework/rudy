// @flow
import { isServer } from '@respond-framework/utils'

export default (req: Object): boolean => {
  const { universal } = req.getLocation()
  return universal && !isServer() && req.getKind() === 'load'
}
