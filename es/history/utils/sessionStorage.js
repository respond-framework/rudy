/* eslint-env browser */
import { supportsSession, supportsHistory } from './index';
import { toEntries } from '../../utils'; // API:
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

export var saveHistory = function saveHistory(_ref, out) {
  var index = _ref.index,
      entries = _ref.entries;
  entries = entries.map(function (e) {
    return [e.location.url, e.state, e.location.key];
  }); // one entry has the url, a state object, and a 6 digit key

  set({
    index: index,
    entries: entries,
    out: out
  });
};
export var restoreHistory = function restoreHistory(api) {
  var history = get() || initializeHistory();
  return format(history, api);
};
export var clear = function clear() {
  return supportsSession() ? sessionClear() : historyClear();
};
export var set = function set(v) {
  return supportsSession() ? sessionSet(v) : historySet(v);
};
export var get = function get() {
  return supportsSession() ? sessionGet() : historyGet();
}; // HISTORY FACADE:

export var pushState = function pushState(url) {
  return window.history.pushState({
    id: sessionId()
  }, null, url);
}; // insure every entry has the sessionId (called by `BrowserHistory`)

export var replaceState = function replaceState(url) {
  return window.history.replaceState({
    id: sessionId()
  }, null, url);
}; // QA: won't the fallback overwrite the `id`? Yes, but the fallback doesn't use the `id` :)

var historyClear = function historyClear() {
  return window.history.replaceState({}, null);
};

var historySet = function historySet(history) {
  return window.history.replaceState(history, null);
}; // set on current entry


var historyGet = function historyGet() {
  var state = getHistoryState();
  return state.entries && state;
}; // SESSION STORAGE FACADE:
// We use `history.state.id` to pick which "session" from `sessionStorage` to use in
// the case that multiple windows containing the app are open at the same time


var _id;

var PREFIX = '@@rudy/';

var sessionId = function sessionId() {
  return _id = _id || createSessionId();
};

var key = function key() {
  return PREFIX + sessionId();
};

var sessionClear = function sessionClear() {
  return window.sessionStorage.setItem(key(), '');
};

var sessionSet = function sessionSet(val) {
  return window.sessionStorage.setItem(key(), JSON.stringify(val));
};

var sessionGet = function sessionGet() {
  try {
    var json = window.sessionStorage.getItem(key());
    return JSON.parse(json);
  } catch (error) {} // ignore invalid JSON


  return null;
};

var createSessionId = function createSessionId() {
  if (!supportsHistory() || !supportsSession()) return 'id'; // both are needed for unique IDs to serve their purpose

  var state = getHistoryState();

  if (!state.id) {
    if (process.env.NODE_ENV === 'test') {
      state.id = '123456789'.toString(36).substr(2, 6);
    } else {
      state.id = Math.random().toString(36).substr(2, 6);
    }

    historySet(state);
  }

  return state.id;
}; // HELPERS:


var initializeHistory = function initializeHistory() {
  var _window$location = window.location,
      pathname = _window$location.pathname,
      search = _window$location.search,
      hash = _window$location.hash;
  var url = pathname + search + hash;
  return {
    n: 1,
    index: 0,
    entries: [url] // default history on first load

  };
}; // We must remove entries after the index in case the user opened a link to
// another site in the middle of the entries stack and then returned via the
// back button, in which case the entries are gone for good, like a `push`.
//
// NOTE: if we did this on the first entry, we would break backing out of the
// site and returning (entries would be unnecessarily removed). So this is only applied to
// "forwarding out." That leaves one hole: if you forward out from the first entry, you will
// return and have problematic entries that should NOT be there. Then because of Rudy's
// automatic back/next detection, which causes the history track to "jump" instead of "push,"
// dispatching an action for the next entry would in fact make you leave the site instead
// of push the new entry! To circumvent that, use Rudy's <Link /> component and it will
// save the `out` flag (just before linking out) that insures this is addressed:


var format = function format(history, api) {
  var entries = history.entries,
      index = history.index,
      out = history.out;
  var ents = index > 0 || out ? entries.slice(0, index + 1) : entries;
  return toEntries(api, ents, index);
}; // IE11 sometimes throws when accessing `history.state`:
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
//
// ALSO NOTE: this would only matter when using our history state fallback, as we don't use
// `history.state` with `sessionStorage`, with one exception: `state.id`. The `id` is used for
// a single edge case: having multiple windows open (see "Session Storage Facade" above).


var getHistoryState = function getHistoryState() {
  try {
    return window.history.state || {};
  } catch (e) {}

  return {};
};
//# sourceMappingURL=sessionStorage.js.map