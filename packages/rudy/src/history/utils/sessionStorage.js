// @flow
/* eslint-env browser */
import { toEntries } from '../../utils'
import { supportsSessionStorage } from '@respond-framework/utils'

// API:

// Below is the facade around both `sessionStorage` and our "history as storage" fallback.
//
// - `saveHistory` is  called every time the history entries or index changes
// - `restoreHistory` is called on startup obviously

/**
 * If there is no `sessionStorage` (which happens e.g. in incognito mode in
 * iOS safari), we have a fallback which is to store the history of stack
 * entries inside the current browser history stack entry. Since we can only
 * access the current history stack entry, this means that if the user
 * returns to the middle of a set of entries within the app, then Rudy will
 * not be aware of the future entries. Navigation will still work, but the
 * entries in the redux state will not include future states, and callbacks
 * related to future states will therefore not work.
 */

export const saveHistory = ({ entries }) => {
  entries = entries.map((e) => [e.location.url, e.state, e.location.key]) // one entry has the url, a state object, and a 6 digit key
  set({ entries })
}

export const restoreHistory = (api) => {
  let history = get()
  if (!history) {
    history = initializeHistory()
  } else {
    history.index = getHistoryState().index
  }
  return format(history, api)
}

export const clear = () => {
  if (supportsSessionStorage()) {
    window.sessionStorage.setItem(key(), '')
  } else {
    const state = window.history.state
    if (state) {
      delete state.stack
      window.history.replaceState(state, null)
    }
  }
  historySet({ index: 0, id: key() })
}

const set = (val) => {
  const json = JSON.stringify(val)
  if (supportsSessionStorage()) {
    window.sessionStorage.setItem(key(), json)
  } else {
    const state = window.history.state || {}
    state.stack = json
    window.history.replaceState(state, null)
  }
}

export const get = () => {
  let json
  if (supportsSessionStorage()) {
    json = window.sessionStorage.getItem(key())
  } else {
    json = (window.history.state || {}).stack
  }
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

// HISTORY FACADE:

export const pushState = (url: string) =>
  window.history.pushState(
    { id: sessionId(), index: getHistoryState().index + 1 },
    null,
    url,
  ) // insure every entry has the sessionId (called by `BrowserHistory`)

export const replaceState = (url: string) =>
  window.history.replaceState(
    { id: sessionId(), index: getHistoryState().index },
    null,
    url,
  ) // QA: won't the fallback overwrite the `id`? Yes, but the fallback doesn't use the `id` :)

export const go = (n) => window.history.go(n)

export const getCurrentIndex = () => getHistoryState().index

const historySet = (history) => window.history.replaceState(history, null) // set on current entry

// SESSION STORAGE FACADE:

// We use `history.state.id` to pick which "session" from `sessionStorage` to use in
// the case that multiple instances of the app exist in the browser history stack of
// the same tab (e.g. if you navigate away from the app and then back again)
let _id

const PREFIX = '@@rudy/'

const sessionId = () => (_id = _id || createSessionId())

const key = () => PREFIX + sessionId()

const createSessionId = () => {
  const state = getHistoryState()

  if (!state.id) {
    if (process.env.NODE_ENV === 'test') {
      state.id = '123456789'.toString(36).substr(2, 6)
    } else {
      state.id = Math.random()
        .toString(36)
        .substr(2, 6)
    }
    state.index = 0
    historySet(state)
  }

  return state.id
}

// HELPERS:

const initializeHistory = () => {
  const { pathname, search, hash } = window.location
  const url = pathname + search + hash
  return { n: 1, index: 0, entries: [url] } // default history on first load
}

const format = (history, api) => {
  const { entries, index } = history
  return toEntries(api, entries, index)
}

// IE11 sometimes throws when accessing `history.state`:
//
// - https://github.com/ReactTraining/history/pull/289
// - https://github.com/ReactTraining/history/pull/230#issuecomment-193555362
//
// The issue occurs:
// A) when you refresh a page that is the only entry and never had state set on it,
// which means it wouldn't have any state to remember in the first place
//
// B) in IE11 on load in iframes, which also won't need to remember state, as iframes
// usually aren't for navigating to other sites (and back). This may just be issue A)
const getHistoryState = () => {
  try {
    return window.history.state || {}
  } catch (e) {
    return {}
  }
}
