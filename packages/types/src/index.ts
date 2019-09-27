/**
 * This package is for types that are shared between the various packages
 * and the outside world.
 */

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
  prev: LocationEntry<Action> | undefined
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
}

/**
 * A Rudy request, associated with the dispatch of an FSRA
 */
export type Request<Action extends FluxStandardRoutingAction> = {
  /**
   * The redux action corresponding to the request. Before the
   * transformAction middleware, the action is an `Action`, whereas
   * after that it is a `LocationAction` if the corresponding
   * route has a `path`
   */
  action: Action | LocationAction<Action>
}

/**
 * Rudy middleware which wraps and optionally changes the behaviour of
 * a request
 */
export type Middleware<Action extends FluxStandardRoutingAction> = (
  api: Api<Action>,
) => (request: Request<Action>, next: () => Promise<any>) => Promise<any>

/**
 * Options for a route, corresponding to FSRAs with a specific Redux action type
 */
export type Route = {}

/**
 * Global Rudy options
 */
export type Options = {}
