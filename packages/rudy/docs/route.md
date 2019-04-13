# Route

A route is a configuration for how Rudy should treat a particular Redux action
type, which may include specifying which URLs it should be synchronised with.

## Transformations

### `toPath/fromPath`

`toPath` and `fromPath` map between the matched string segments in the URL path
and the values your app sees in the action `params`. The URL side is one of the
following types:

- For single segment params (`repeat: false`), a string
- For optional single segment params (`repeat: false, optional: true`),
  `undefined`
- For multi segment params (`repeat: true`), an array of strings. The array may
  be empty if the parameter is optional.

The app side can be one of the following:

- `undefined` (which is ignored and will not included in `params`)
- any other value.

```javascript
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
