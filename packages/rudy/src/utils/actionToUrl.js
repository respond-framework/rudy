// @flow
import pathToRegexp from 'path-to-regexp'
import { applyStringDefault, applyObjectDefault } from './applyDefaults'
import { compileUrl, cleanBasename } from './index'

import type {
  Route,
  Routes,
  ReceivedAction,
  Options,
  ToPath,
} from '../flow-types'

export default (
  action: ReceivedAction,
  api: Object,
  prevRoute?: string,
): Object => {
  const { routes, options: opts }: Object = api
  const { type, params, query, state, hash, basename }: ReceivedAction = action

  const route = routes[type] || {}
  const path: string | void = typeof route === 'object' ? route.path : route

  const p: Object = formatParams(params, route, opts) || {}
  const q: ?Object = formatQuery(query, route, opts)
  const s: Object = formatState(state, route, opts) || {}
  const h: string = formatHash(hash || '', route, opts)

  const bn = cleanBasename(basename)
  const isWrongBasename = bn && !opts.basenames.includes(bn)
  if (basename === '') s._emptyBn = true // not cool kyle

  if (isWrongBasename) {
    throw new Error(`[rudy] basename "${bn}" not in options.basenames`)
  }

  // path-to-regexp throws for failed compilations
  const pathname: string = compileUrl(path, p, q, h, route, opts) || '/'
  const url: string = bn + pathname

  return { url, state: s }
}

const formatParams = (
  params: ?Object,
  route: Route,
  opts: Options,
): void | {} => {
  params = applyObjectDefault(route.defaultParams || opts.defaultParams)(
    params,
    route,
    opts,
  )

  if (params) {
    const keys = []
    pathToRegexp(typeof route === 'string' ? route : route.path, keys)
    const newParams: {} = {}
    const toPath: ToPath = route.toPath || opts.toPath || defaultToPath
    keys.forEach(
      ({
        name,
        repeat,
        optional,
      }: {
        name: string | Number,
        repeat: boolean,
        optional: boolean,
      }) => {
        if (!Object.prototype.hasOwnProperty.call(params, name)) {
          return
        }
        // $FlowFixMe
        const val = params[name]
        const urlVal = toPath(
          val,
          { name: name.toString(), repeat, optional },
          route,
          opts,
        )
        if (repeat) {
          if (!Array.isArray(urlVal)) {
            throw Error('toPath failed')
          }
          if (!optional && !urlVal.length) {
            throw Error('toPath failed')
          }
          urlVal.forEach((segment) => {
            if (typeof segment !== 'string' || !segment) {
              throw Error('toPath failed')
            }
          })
        } else if (
          typeof urlVal !== 'string' &&
          (!optional || urlVal !== undefined)
        ) {
          throw Error('toPath failed')
        }
        newParams[name.toString()] = urlVal
      },
    )
    return newParams
  }
  return undefined
}

const toSegment = (val, convertNum, capitalize, optional) => {
  if (typeof val === 'number' && convertNum) {
    return val.toString()
  }
  if (typeof val !== 'string' || (optional && !val)) {
    throw TypeError('[rudy]: defaultToPath::toSegment received unknown type')
  }
  if (capitalize) {
    return val.replace(/ /g, '-').toLowerCase()
  }
  return val
}

export const defaultToPath: ToPath = (
  val,
  { repeat, optional },
  route,
  opts,
) => {
  const convertNum =
    route.convertNumbers ||
    (opts.convertNumbers && route.convertNumbers !== false)

  const capitalize =
    route.capitalizedWords ||
    (opts.capitalizedWords && route.capitalizedWords !== false)

  if (repeat) {
    if (optional && val === undefined) {
      return []
    }
    if (!val) {
      throw Error('defaultToPath received incorrect value')
    }
    return val.split('/')
  }
  if (optional && val === undefined) {
    return undefined
  }
  return toSegment(val, convertNum, capitalize, optional)
}

export const formatQuery = (
  query: ?Object,
  route: Route,
  opts: Options,
): ?Object => {
  query = applyObjectDefault(route.defaultQuery || opts.defaultQuery)(
    query,
    route,
    opts,
  )
  const to = route.toSearch || opts.toSearch

  if (to && query) {
    const newQuery = {}

    Object.keys(query).forEach((key) => {
      // $FlowFixMe
      newQuery[key] = to(query[key], key, route, opts)
    })

    return newQuery
  }

  return query
}

export const formatHash = (
  hash: string,
  route: Route,
  opts: Options,
): string => {
  hash = applyStringDefault(route.defaultHash || opts.defaultHash)(
    hash,
    route,
    opts,
  )
  const to = route.toHash || opts.toHash
  return to ? to(hash, route, opts) : hash
}

const formatState = (state: ?Object, route: Route, opts: Options): ?Object =>
  applyObjectDefault(route.defaultState || opts.defaultState)(
    state,
    route,
    opts,
  )
// state has no string counter part in the address bar, so there is no `toState`

const notFoundUrl = (
  action: ReceivedAction,
  routes: Routes,
  opts: Options,
  query: ?Object,
  hash: string,
  prevRoute: string = '',
): string => {
  const type: string = action.type || ''
  const route: {} = routes[type] || {}
  const hasScene: boolean = type.indexOf('/NOT_FOUND') > -1
  // TODO: Look into scene stuff
  // $FlowFixMe
  const scene: string = route.scene || prevRoute.scene || ''
  const t: string = hasScene
    ? type
    : routes[`${scene}/NOT_FOUND`] // try to interpret scene-level NOT_FOUND if available (note: links create plain NOT_FOUND actions)
      ? `${scene}/NOT_FOUND`
      : 'NOT_FOUND'

  const p: string = routes[t].path || routes.NOT_FOUND.path || ''

  // preserve these (why? because we can)
  const s: string =
    query && opts.stringifyQuery ? `?${opts.stringifyQuery(query)}` : ''
  const h: string = hash ? `#${hash}` : ''

  return p + s + h
}
