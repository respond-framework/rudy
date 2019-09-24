/**
 * TODO: port the rest of this package to typescript, and export these
 * types (or a more complete version of them) from the entry point.
 */

export interface FluxStandardRoutingAction {
  type: string;
}

export type Location<Action extends FluxStandardRoutingAction> = {
  hash: string
  key: string
  prev: DispatchedAction<Action> | undefined
  lastScrollPosition?: [number, number]
}

export type DispatchedAction<Action extends FluxStandardRoutingAction> = Action & {
  location: Location<Action>
}

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
