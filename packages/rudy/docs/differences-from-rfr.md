Rudy began as a fork of
[redux-first-router](https://github.com/faceyspacey/redux-first-router). Since
then it has changed a great deal but still supports a very similar basic API.
This is an overview of its differences from redux-first-router.

# New features

- URL handling has been extended to include hash strings and "state" (as in the
  browser pushState API), through the corresponding keys in routing actions
- There is an extensible asynchronous middleware API. A Redux routing action
  becomes a request, and the request passes though the configured middlewares.
  The default middlewares replicate similar behaviour to redux-first-router, but
  they are much more flexible.
- All callbacks are asynchronous (i.e. if callbacks return promises, the
  remaining middlewares do not execute until the promise is resolved). Since
  both callbacks and changing the URL are examples of middleware, callbacks that
  happen before the URL change can delay, change, or cancel the URL change.
- Actions can be blocked by returning false (or a promise that resolves to
  false) from callbacks taht occur before the transition, such as `beforeLeave`.
  They can be unblocked by dispatching `confirm(canLeave)`, which continues or
  cancels the request/action as appropriate.
- Callbacks can be defined both globally and in specific routes and they will be
  executed concurrently
- Callbacks can be set up to happen on both SSR and hydrate, which is useful for
  code splitting reducers

# Breaking changes

- `[NOT_FOUND]` -> `"NOT_FOUND"` in reducers (e.g. page reducer).
- `connectRoutes` has been renamed to `createRouter` and does not return
  `enhancer` anymore.
- `firstRoute`, now returned from `createRouter`, must be invoked before
  rendering.
- `payload` has been renamed to `params`, e.g. `{ type: 'FOO', params: {} }` and
  `state.location.params`.
- `actionToPath` and `pathToAction` have been replaced with `actionToUrl` and
  `urlToAction`. The URL side is no longer only a string, but an object with a
  `url` (pathname, query, hash) and a `state`)
- The global callbacks from RFR have been renamed:
  - `onBeforeChange` -> `beforeChange`
  - `onAfterChange` -> `afterChange`
- Callbacks including `thunk`, `beforeChange`, etc are no longer passed
  `(dispatch, getState, bag)` - instead they are passed the `Request` object,
  which contains keys `dispatch`, `getState`, and others previously in `bag`
  such as `action`
- `action.meta` no longer exists in routing actions. If it or other unrecognised
  keys are provided, they will be removed
- URLs without trailing slashes will no longer be matched by route regexes with
  trailing slashes (due to an upgrade of the `path-to-regexp` library). By
  default, URLs with trailing slashes will still match route regexes without
  trailing slashes.
- `confirmLeave` and `displayConfirmLeave` no longer exist. They have been
  replaced by the new request blocking feature.
