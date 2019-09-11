// @flow
/* eslint-env browser */
import { toEntries } from '../../utils'

// API:

// Below is the facade around both `sessionStorage` and our "history as storage" fallback.
//
// - `saveHistory` is  called every time the history entries or index changes
// - `restoreHistory` is called on startup obviously

// Essentially the idea is that if there is no `sessionStorage`, we maintain the entire
// storage object on EACH AND EVERY history entry's `state`. I.e. `history.state` on
// every page will have the `index` and `entries` array. That way when browsers disable
// cookies/sessionStorage, we can still grab the data we need off off of history state :)
//
// It's a bit crazy, but it works very well, and there's plenty of space allowed for storing
// things there to get a lot of mileage out of it. We store the minimum amount of data necessary.
//
// Firefox has the lowest limit of 640kb PER ENTRY. IE has 1mb and chrome has at least 10mb:
// https://stackoverflow.com/questions/6460377/html5-history-api-what-is-the-max-size-the-state-object-can-be

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
  window.sessionStorage.setItem(key(), '')
  historySet({ index: 0, id: key() })
}

const set = (val) => window.sessionStorage.setItem(key(), JSON.stringify(val))

export const get = () => {
  try {
    const json = window.sessionStorage.getItem(key())
    return JSON.parse(json)
  } catch (error) {
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
