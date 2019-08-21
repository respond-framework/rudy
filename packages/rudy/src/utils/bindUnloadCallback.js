/* eslint-env browser */

import { isServer } from '@respond-framework/utils'

export default (api, eventName, callback) => {
  if (isServer()) {
    return () => {}
  }
  const wrappedCallback = (event) => {
    const result = callback(api)
    if (eventName === 'beforeunload' && result === false) {
      // Cancel the event as stated by the standard.
      event.preventDefault()
      // Chrome requires returnValue to be set.
      event.returnValue = ''
    }
  }
  window.addEventListener(eventName, wrappedCallback)
  return () => window.removeEventListener(eventName, wrappedCallback)
}
