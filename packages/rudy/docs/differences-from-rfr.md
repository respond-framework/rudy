# Differences from [redux-first-router](https://github.com/faceyspacey/redux-first-router)

- `[NOT_FOUND]` -> `"NOT_FOUND"` in reducers (e.g. page reducer).
- `connectRoutes` has been renamed to `createRouter` and does not return
  `enhancer` anymore.
- `firstRoute`, now returned from `createRouter`, must be invoked before
  rendering.
- `payload` has been renamed to `params`, e.g. `{ type: 'FOO', params: {} }` and
  `state.location.params`.
