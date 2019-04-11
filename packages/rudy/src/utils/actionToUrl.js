// @flow
import pathToRegexp from 'path-to-regexp'
import { compileUrl, cleanBasename } from './index'

import type {
  Route,
  Routes,
  ReceivedAction as Action,
  Options,
  ToPath,
  DefaultParams,
} from '../flow-types'

export default (action: Action, api: Object, prevRoute?: string): Object => {
  const { routes, options: opts }: Object = api
  const { type, params, query, state, hash, basename }: Action = action

  const route = routes[type] || {}
  const path: string | void = typeof route === 'object' ? route.path : route

  const q: mixed = formatQuery(query, route, opts)
  const s: ?Object = formatState(state, route, opts)
  const h: string = formatHash(hash, route, opts)
  const bn = cleanBasename(basename)
  const isWrongBasename = bn && !opts.basenames.includes(bn)
  // $FlowFixMe
  if (basename === '') s._emptyBn = true // not cool kyle

  try {
    if (isWrongBasename) {
      throw new Error(`[rudy] basename "${bn}" not in options.basenames`)
    }
    const p: void | {} = formatParams(params || {}, route, opts)

    // path-to-regexp throws for failed compilations;
    // we made our queries + hashes also throw to conform
    const pathname: string = compileUrl(path, p, q, h, route, opts) || '/'
    const url: string = bn + pathname

    return { url, state: s }
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(
        `[rudy] unable to compile action "${type}" to URL`,
        action,
        e,
      )
    } else if (process.env.NODE_ENV === 'test') {
      // eslint-disable-next-line no-console
      console.log(`[rudy] unable to compile action "${type}" to URL`, action, e)
    }

    const base: string = isWrongBasename ? '' : bn
    const url: string =
      base + notFoundUrl(action, routes, opts, q, h, prevRoute)
    return { url, state: s }
  }
}

const formatParams = (
  params: Object,
  route: Route,
  opts: Options,
): void | {} => {
  const def: DefaultParams = route.defaultParams || opts.defaultParams || {}

  params =
    typeof def === 'function'
      ? def(params || {}, route, opts)
      : { ...def, ...params }

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
        repeat: Boolean,
        optional: Boolean,
      }) => {
        if (!Object.prototype.hasOwnProperty.call(params, name)) {
          return
        }
        const val = params[name]
        newParams[name.toString()] = toPath(
          val,
          { name: name.toString(), repeat, optional },
          route,
          opts,
        )
      },
    )
    return newParams
  }
  return undefined
}

const toSegment = (val, convertNum, capitalize) => {
  if (typeof val === 'number' && convertNum) {
    return val.toString()
  }
  if (typeof val !== 'string') {
    throw TypeError('[rudy]: defaultToPath::toSegment received unknown type')
  }
  if (capitalize) {
    return val.replace(/ /g, '-').toLowerCase()
  }
  return val
}

const defaultToPath = (
  val: any,
  { repeat, optional },
  route: Route,
  opts: Options,
): void | string | Array<string> => {
  const convertNum =
    route.convertNumbers ||
    (opts.convertNumbers && route.convertNumbers !== false)

  const capitalize =
    route.capitalizedWords ||
    (opts.capitalizedWords && route.capitalizedWords !== false)

  if (
    repeat &&
    (typeof val === 'string' || val === undefined || val === null)
  ) {
    return val ? val.split('/') : []
  }
  if (!repeat && optional && val === undefined) {
    return undefined
  }
  return toSegment(val, convertNum, capitalize)
}

const formatQuery = (query: ?Object, route: Route, opts: Options): mixed => {
  const def = route.defaultQuery || opts.defaultQuery
  query = def
    ? typeof def === 'function'
      ? def(query, route, opts)
      : { ...def, ...query }
    : query

  const to = route.toSearch || opts.toSearch

  if (to && query) {
    const newQuery = {}

    Object.keys(query).forEach((key) => {
      newQuery[key] = to(query[key], key, route, opts)
    })

    return newQuery
  }

  return query
}

const formatHash = (hash: string = '', route: Route, opts: Options): string => {
  const def: string | void | Function | string =
    route.defaultHash || opts.defaultHash
  hash = def
    ? typeof def === 'function'
      ? def(hash, route, opts)
      : hash || def
    : hash
  const to = route.toHash || opts.toHash
  return to ? to(hash, route, opts) : hash
}

const formatState = (
  state: ?Object = {},
  route: Route,
  opts: Options,
): ?Object => {
  const def: mixed = route.defaultState || opts.defaultState
  return def
    ? typeof def === 'function'
      ? def(state, route, opts)
      : { ...def, ...state }
    : state
} // state has no string counter part in the address bar, so there is no `toState`

const notFoundUrl = (
  action: Action,
  routes: Routes,
  opts: Options,
  query: mixed,
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
  // $FlowFixMe
  const s: string = query
    ? opts.stringifyQuery(query, { addQueryPrefix: true })
    : '' // preserve these (why? because we can)
  const h: string = hash ? `#${hash}` : ''

  return p + s + h
}
