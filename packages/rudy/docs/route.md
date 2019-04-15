# Route

A route is a configuration for how Rudy should treat a particular Redux action
type, which may include specifying which URLs it should be synchronised with.

Unless otherwise stated, all route options can equally be set on the global
options. The value set on the route takes precedence over the global options if
it is set.

## Transformations

### `convertNumbers`

```javascript
type Route = {
  // ...
  convertNumbers?: boolean,
}
```

When enabled, this causes numbers in `action.params` to be mapped to strings in
the URL. It works only for single segment params. Disabled by default.

### `capitalizedWords`

```javascript
type Route = {
  // ...
  capitalizedWords?: boolean,
}
```

When enabled, this causes capital case strings in `action.params` to be mapped
to snake case in the URL. For example, `The Quick Fox` would become
`the-quick-fox` and vice versa. Disabled by default.

### `toPath`/`fromPath`

`toPath` and `fromPath` map between the matched string segments in the URL path
and the values your app sees in the action `params`. The URL side is one of the
following types:

- For single segment params (`repeat: false`), a string. The string may be empty
  only if the parameter is compulsory.
- For optional single segment params (`repeat: false, optional: true`),
  `undefined`
- For multi segment params (`repeat: true`), an array of strings. The array may
  be empty if the parameter is optional.

The app side can be one of the following:

- `undefined` (which is ignored and will not included in `params`)
- any other value.

```javascript
type Route = {
  // ...
  toPath?: ToPath,
  fromPath?: FromPath,
}

export type FromPath = (
  val: void | string | Array<string>,
  { name: string, repeat: Boolean, optional: Boolean },
  route: Route,
  opts: Options,
) => any

export type ToPath = (
  val: any,
  { name: string, repeat: Boolean, optional: Boolean },
  route: Route,
  opts: Options,
) => void | string | Array<string>
```

To customize the transformation into how you want your app to see it, here's how
a date could be handled:

```js
POST: {
  path: '/post/:slug/:date',
  fromPath: (val, { name }, route, options) => name === 'date' ? new Date(val) : val,
  toPath: (val, { name }, route, options) => {
    if (name === 'date') {
      const month = numToMonth(val.getMonth())
      const day = val.getUTCDate()
      const year = val.getFullYear()

      return `${month}-${day}-${year}`
    }

    return value
  }
},
```

Notice you are passed each param one by one, where the `name` is the name of the
param.

#### Defaults

The default `toPath` does the following (and vice versa in `fromPath` as much as
possible):

- Implement the functionality of the `convertNumbers` and `capitalizedWords`
  options. If you override the defaults, these options will not work.
- For multi segment params, convert strings into arrays, split on `/`. Note that
  this means you cannot include `/` in individual segments of a multi segment
  param!
- Fail (redirect to a 404) if other types are provided in params

Note: If values provided in `action.params` are of an inappropriate type (for
example `null`, `undefined` for compulsory parameters, numbers when
`converNumbers` is disabled, etc) then the default `toPath` will throw an
exception, causing the action to fail. This is so that `toPath` and `fromPath`
are fully symmetrical by default.

### `defaultParams`/`defaultQuery`/`defaultState`/`defaultHash`

```javascript
type ObjectDefault = Object | ((?Object, Route, Options) => ?Object)
type StringDefault = string | ((?string, Route, Options) => string)

type Route = {
  // ...
  defaultParams?: ObjectDefault,
  defaultQuery?: ObjectDefault,
  defaultState?: ObjectDefault,
  defaultHash?: StringDefault,
}
```

These provide a way of setting default values for each part of routing actions.
They are applied in both directions (from/to URLs). They are applied on the
Redux side of serialization (`fromPath/toPath`, query serialization, etc).

For the object types (params, query, state) there are two choices:

- An object containing default values. Keys that are missing or `undefined` in
  the URL/action are replaced with their default values
- A function that receives the values from the URL/action and returns the object
  with defaults as it sees fit.

For `defaultHash`, there are also two options:

- A string, which is used as the hash if the hash in the URL/action is empty or
  `undefined`
- A function, which receives the hash from the URL/action and can return a
  different one as it sees fit
