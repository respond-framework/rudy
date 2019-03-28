Rudy began as a fork of
[redux-first-router](https://github.com/faceyspacey/redux-first-router). Since
then it has changed a great deal but still supports a very similar basic API.
This is an overview of its differences from redux-first-router.

# New features

TODO

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
- `action.meta` no longer exists in routing actions. If it or other unrecognixed
  keys are provided, they will be removed
- URLs without trailing slashes will no longer match route regexes with trailing
  regexes (due to an upgrade of the `path-to-regexp` library). By default, URLs
  with trailing slashes will still match route regexes without trailing slashes.
