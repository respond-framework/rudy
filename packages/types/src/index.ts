/**
 * This package is for types that are shared between the various packages
 * and the outside world.
 */

import { ScrollPosition } from 'scroll-behavior'

/**
 * Standard interface for redux actions which map to URLs/routes
 */
export interface FluxStandardRoutingAction {
  type: string
  params?: {}
  query?: {}
  state?: {}
  hash?: string
  basename?: string
}

export type LocationEntry<Action extends FluxStandardRoutingAction> = Required<
  Action
> & {
  location: {
    key: string
    scene: string
    url: string
    pathname: string
    search: string
  }
}

/**
 * This is a location entry which is the "previous" entry in the case that
 * there is in fact no previous entry
 */
export interface NullLocationEntry
  extends LocationEntry<FluxStandardRoutingAction> {
  type: ''
  params: {}
  query: {}
  state: {}
  hash: ''
  basename: ''
  location: {
    url: ''
    pathname: ''
    search: ''
    key: ''
    scene: ''
    index: -1
  }
}

export type Kind =
  | 'load'
  | 'push'
  | 'replace'
  | 'back'
  | 'next'
  | 'jump'
  | 'set'
  | 'reset'

export type Direction = 'forward' | 'backward'

export type DispatchedLocation<
  Action extends FluxStandardRoutingAction
> = Required<Action> & {
  prev: LocationEntry<Action> | NullLocationEntry
  entries: LocationEntry<Action>[]
  index: number
  length: number
  kind: Kind
  direction: Direction
  n: number
  url: string
  pathname: string
  search: string
  key: string
  scene: string
  pop: boolean
  status: number
}

/**
 * A routing action as it is between transformAction and the reducers
 */
export type LocationAction<Action extends FluxStandardRoutingAction> = Required<
  Action
> & {
  location: DispatchedLocation<Action>
}

/**
 * The shape of the Rudy location reducer state
 */
export type Location<Action extends FluxStandardRoutingAction> = LocationAction<
  Action
> &
  DispatchedLocation<Action>

/**
 * An instance of the Rudy API
 */
export interface Api<Action extends FluxStandardRoutingAction> {
  getLocation: () => Location<Action>
  scrollRestorer?: ScrollRestorer<Action>
  options: Options<Action>
}

/**
 * A Rudy request, associated with the dispatch of an FSRA
 */
export type Request<Action extends FluxStandardRoutingAction> = Api<Action> & {
  /**
   * The redux action corresponding to the request. Before the
   * transformAction middleware, the action is an `Action`, whereas
   * after that it is a `LocationAction` if the corresponding
   * route has a `path`
   */
  action: Action | LocationAction<Action>
}

/**
 * Resolved return value of a middleware function
 *
 * TODO: Fix !45 and allow truthy primitive values to be returned
 */
type MiddlewareResolvedResult<Action extends FluxStandardRoutingAction> =
  | Action
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Object
  | Function
  | false
  | ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | any[]

/**
 * Return value of a middleware function
 */
export type MiddlewareResult<Action extends FluxStandardRoutingAction> =
  | Promise<MiddlewareResolvedResult<Action>>
  | MiddlewareResolvedResult<Action>

/**
 * Rudy middleware which wraps and optionally changes the behaviour of
 * a request
 */
export type Middleware<Action extends FluxStandardRoutingAction> = (
  api: Api<Action>,
) => (
  request: Request<Action>,
  next: () => MiddlewareResult<Action>,
) => MiddlewareResult<Action>

export interface ScrollRestorer<Action extends FluxStandardRoutingAction> {
  saveScroll: Middleware<Action>
  restoreScroll: Middleware<Action>
  updateScroll: () => void
  readScrollPosition: (
    entry: LocationEntry<Action>,
    key: string | null,
  ) => ScrollPosition | null
}

export type ScrollRestorerCreator<Action extends FluxStandardRoutingAction> = (
  api: Api<Action>,
) => ScrollRestorer<Action>

/**
 * Options for a route, corresponding to FSRAs with a specific Redux action type
 */
export type Route = {}

/**
 * Global Rudy options
 */
export type Options<Action extends FluxStandardRoutingAction> = {
  restoreScroll?: ScrollRestorerCreator<Action>
}
