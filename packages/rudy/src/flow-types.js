// @flow
import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux'
import { CALL_HISTORY } from './types'

export type Dispatch = ReduxDispatch<*>
export type GetState = () => Object

export type BeforeLeave = (
  state: Object,
  action: Object,
  bag: Bag,
) => any | Promise<any>

export type Bag = {
  action: ReceivedAction | Action | Location,
  extra: any,
}

export type AsyncCallback = (
  dispatch: Dispatch,
  getState: GetState,
  bag: Bag,
) => ?any | Promise<any>

export type FromPath = (
  val: void | string | Array<string>,
  { name: string, repeat: boolean, optional: boolean },
  route: Route,
  opts: Options,
) => any

export type ToPath = (
  val: any,
  { name: string, repeat: boolean, optional: boolean },
  route: Route,
  opts: Options,
) => void | string | Array<string>

export type ObjectDefault = Object | ((?Object, Route, Options) => ?Object)
export type StringDefault = string | ((?string, Route, Options) => string)

export type Route = {
  path?: string,
  toPath?: ToPath,
  type?: string,
  scene?: string,
  navKey?: string,
  redirect?: Function,
  toSearch?: Function,
  defaultParams?: ObjectDefault,
  defaultQuery?: ObjectDefault,
  defaultState?: ObjectDefault,
  defaultHash?: StringDefault,
  thunk?: AsyncCallback,
  beforeLeave?: BeforeLeave,
  onFail?: AsyncCallback,
  capitalizedWords?: boolean,
  convertNumbers?: boolean,
  onEnter?: AsyncCallback,
  onLeave?: AsyncCallback,
  onComplete?: AsyncCallback,
  beforeEnter?: AsyncCallback,
  defaultHash?: Function | string,
  parseSearch?: (?string) => Object,
  stringifyQuery?: (?Object) => string,
  fromSearch?: Function,
  fromPath?: FromPath,
  toHash?: (hash: string, route: Route, opts: Options) => string,
}

export type RouteInput = Function | Route

export type RoutesInput = {
  [key: string]: RouteInput,
}

export type Routes = {
  [key: string]: Route,
}

export type Router = {
  getStateForActionOriginal: (action: Object, state: ?Object) => ?Object,
  getStateForAction: (action: Object, state: ?Object) => ?Object,
  getPathAndParamsForState: (
    state: Object,
  ) => { path: ?string, params: ?Object },
  getActionForPathAndParams: (path: string) => ?Object,
}

export type Navigator = {
  router: Router,
}

export type Navigators = {
  [key: string]: Navigator,
}

export type RouteNames = Array<string>

export type SelectLocationState = (state: Object) => LocationState
export type SelectTitleState = (state: Object) => string

export type QuerySerializer = {
  stringify: (params: Object) => string,
  parse: (queryString: string) => Object,
}

export type ActionToNavigation = (
  navigators: Navigators,
  action: Object,
  navigationAction: ?NavigationAction,
  route: ?Route,
) => Object

export type NavigationToAction = (
  navigators: Navigators,
  store: Store,
  routesMap: Routes,
  action: Object,
) => {
  action: Object,
  navigationAction: ?NavigationAction,
}

// TODO: Question: Is can this be split up to sub-types at some point.
export type Options = {
  extra?: any,
  toPath?: ?any,
  toSearch?: any,
  capitalizedWords?: boolean,
  convertNumbers?: boolean,
  basename?: string,
  basenames?: Array<string>,
  scrollTop?: boolean,
  notFoundPath?: string,
  defaultState?: ObjectDefault,
  defaultQuery?: ObjectDefault,
  defaultParams?: ObjectDefault,
  defaultHash?: StringDefault,
  thunk?: AsyncCallback,
  beforeLeave?: BeforeLeave,
  onFail?: AsyncCallback,
  onEnter?: AsyncCallback,
  onLeave?: AsyncCallback,
  onError?: AsyncCallback,
  onComplete?: AsyncCallback,
  onBackNext?: AsyncCallback,
  beforeEnter?: AsyncCallback,
  defaultHash?: Function | string,
  title?: string | SelectTitleState,
  querySerializer?: QuerySerializer,
  parseSearch?: (?string) => Object,
  stringifyQuery?: (?Object) => string,
  location?: string | SelectLocationState,
  initialEntries?: string | Array<string>,
  restoreScroll?: (History) => ScrollBehavior,
  createHistory?: (options?: Object) => History,
  toHash?: (hash: string, route: Route, opts: Options) => string,
  shouldTransition?: AsyncCallback,
  createRequest?: AsyncCallback,
  compose?: AsyncCallback,
  fromPath?: FromPath,
  navigators?: {
    navigators: Navigators,
    patchNavigators: (navigators: Navigators) => void,
    actionToNavigation: ActionToNavigation,
    navigationToAction: NavigationToAction,
  },
}

export type ScrollBehavior = Object

export type Params = { [string]: any }
export type Payload = Object

export type LocationState = {
  type: string,
  kind: ?string,
  query?: Object,
  prev: Location,
  search?: string,
  universal?: true,
  pathname: string,
  payload: Payload,
  routesMap: Routes,
  history: ?HistoryData,
}

export type Location = {
  pathname: string,
  type: string,
  payload: Payload,
  query?: Object,
  search?: string,
}

export type ActionMetaLocation = {
  current: Location,
  prev: Location,
  from: string,
  kind: ?string,
  history: ?HistoryData,
}

export type NavigationAction = {
  type: string,
  key?: ?string,
  navKey?: ?string,
  routeName?: string,
  actions?: Array<NavigationAction>,
  action?: NavigationAction,
  params?: Object,
  meta?: Object,
}

export type Meta = {
  location: ActionMetaLocation,
  notFoundPath?: string,
  navigation?: NavigationAction,
  query?: Object,
  search?: string,
}

export type HistoryData = {
  entries: Array<{ pathname: string }>,
  index: number,
  length: number,
}

export type HistoryRouteAction = {
  payload: {
    args: Array<mixed>,
    method: string,
  },
  type: string,
}

export type Action = {
  meta: Meta,
  type: string,
  kind?: ?string,
  query?: Object,
  payload: Payload,
  navKey?: ?string,
  tmp?: Object,
}

export type CreateReducerAction = {
  type: string,
  basename?: string,
  hash?: string,
  location?: SelectLocationState,
  params?: Object,
  state?: Object,
}

export type ReceivedAction = {
  type: string,
  meta?: Object,
  hash?: string,
  state?: Object,
  query?: Object,
  search?: string,
  params?: Params,
  payload?: Payload,
  navKey?: ?string,
  basename?: ?string,
  pathname?: string,
}

export type ReceivedActionMeta = {
  type: string,
  payload: Payload,
  query?: Object,
  navKey?: ?string,
  meta: {
    notFoundPath?: string,
    query?: Object,
    search?: string,
  },
}

export type Listener = (HistoryLocation, HistoryAction) => void
export type Listen = (Listener) => void
export type Push = (pathname: string, state?: any) => void
export type Replace = (pathname: string, state?: any) => void
export type GoBack = () => void
export type GoForward = () => void
export type Go = (number) => void
export type CanGo = (number) => boolean
export type BlockFunction = (location: HistoryLocation) => any | Promise<any>

export type History = {
  listen: Listen,
  push: Push,
  replace: Replace,
  goBack: GoBack,
  goForward: GoForward,
  go: Go,
  canGo: CanGo,
  entries: Array<{ pathname: string }>,
  index: number,
  length: number,
  location: HistoryLocation,
  block: (func: BlockFunction) => void,
}

export type LocationActionMeta = {
  url: string,
  status: number,
  kind?: string,
  from?: string,
}

export type LocationAction = {
  location: LocationActionMeta,
}

export type RequestAPI = {
  cache: {
    isCached: Function,
    cacheAction: Function,
    clear: Function,
  },
  routes: Routes,
  resolveFirstRouteOnEnter: boolean,
  dispatch: Dispatch,
  getLocation: Function,
  getState: GetState,
  ctx: Object,
  has: Function,
  register: Function,
  options: Options,
  history: () => {
    routes: Routes,
    options: Options,
    firstAction: Action,
    dispatch: Dispatch,
    getLocation: Function,
  },
}

export type HistoryLocation = {
  pathname: string,
  search?: string,
  hash?: string,
}

export type AddRoutes = {
  action: Action,
  options: Options,
  routes: Routes,
  has: Function,
}

export type ClearCache = {
  action: Action,
  cache: Cache,
  has: Function,
}

export type CallHistory = {
  routes: Routes,
  options: Options,
  firstAction: Action,
}

export type HistoryActionDispatcher = {
  dispatch: Dispatch,
  action: Action,
  history: CallHistory,
  has: Function,
}

export type HistoryAction = string

export type Document = Object

export type Store = ReduxStore<*, *>

export type CreateActionsOptions = {
  logExports: ?boolean,
  scene: ?string,
  basename: ?string,
}

export type Confirm = {
  action: Action,
  ctx: Object,
  has: Function,
  _dispatched?: boolean,
}

export type Cache = {
  isCached: Function,
  cacheAction: Function,
  clear: Function,
}

export type ComposeCurryArgs = Redirect

export type Prev = {
  type: string,
  hash: string,
  query: Object,
  state: Object,
  params: Params,
  basename: string,
  location: SelectLocationState,
}

export type RequestAction = {
  type: string,
  hash: string,
  query: Object,
  commit: Action,
  params: Params,
  location: LocationState,
}
