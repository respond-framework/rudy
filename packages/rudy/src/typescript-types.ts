/**
 * TODO: port the rest of this package to typescript, and export these
 * types (or a more complete version of them) from the entry point.
 */

export interface FluxStandardRoutingAction {
  type: string;
}

export type LocationEntry<Action extends FluxStandardRoutingAction> = Action & {
  location: {
    key: string,
    scene: string,
    url: string,
    pathname: string,
    search: string,
  },
}

export type DispatchedLocation<Action extends FluxStandardRoutingAction> = Action & {
  prev: LocationEntry<Action> | undefined
  entries: LocationEntry<Action>[],
  index: number,
  length: number,
}

// A routing action as it is between transformAction and the reducers
export type DispatchedAction<Action extends FluxStandardRoutingAction> = Action & {
  location: DispatchedLocation<Action>
}

// The shape of the location reducer state
export type Location<Action extends FluxStandardRoutingAction> = Action & DispatchedLocation<Action>

export interface Api<Action extends FluxStandardRoutingAction> {
  getLocation: () => Location<Action>
}

export type Request<Action extends FluxStandardRoutingAction> = {
  action: Action
}

export type Middleware<Action extends FluxStandardRoutingAction> = (
  api: Api<Action>,
) => (request: Request<Action>, next: () => Promise<any>) => Promise<any>

export type Route = {}

export type Options = {}
