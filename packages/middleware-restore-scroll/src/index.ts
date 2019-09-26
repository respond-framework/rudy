/* eslint-env browser */
import ScrollBehavior, {
  TransitionHook,
  ScrollPosition,
} from 'scroll-behavior'
import { isServer } from '@respond-framework/utils'
import {
  Api,
  Middleware,
  LocationEntry,
  FluxStandardRoutingAction,
  DispatchedAction,
  Request
} from '@respond-framework/rudy/src/typescript-types'

export type ShouldUpdateScroll<Action extends FluxStandardRoutingAction> =
  (request: Request<Action>) => string | boolean | number | [number, number]

export type RestoreScrollOptions<Action extends FluxStandardRoutingAction> = {
  shouldUpdateScroll?: ShouldUpdateScroll<Action>
}

export default class RestoreScroll<Action extends FluxStandardRoutingAction> {
  options: RestoreScrollOptions<Action>

  behavior?: ScrollBehavior<LocationEntry<Action>, Request<Action>, never>

  lastRequest?: Request<Action>

  api?: Api<Action>

  transitionHooks: { [index: string]: TransitionHook } = {}

  nextHookIndex = 0

  _makeStorageKey = (
    entry: LocationEntry<Action> | null,
    scrollBehaviorKey: string | null,
  ): string =>
    `@@rudy-restore-scroll/${
      entry ? `${entry.location.key}/` : ``
    }${JSON.stringify(scrollBehaviorKey)}`

  saveScrollPosition = (entry: LocationEntry<Action>, key: string | null, value: ScrollPosition): void => {
    window.sessionStorage.setItem(
      this._makeStorageKey(entry, key),
      JSON.stringify(value),
    )
  }

  readScrollPosition = (entry: LocationEntry<Action>, key: string | null): ScrollPosition | null => {
    const savedItem = window.sessionStorage.getItem(
      this._makeStorageKey(entry, key),
    )
    if (savedItem === null) {
      return null
    }
    try {
      return JSON.parse(savedItem)
    } catch {
      return null
    }
  }

  constructor(options: RestoreScrollOptions<Action> = {}) {
    this.options = options
  }

  _getCurrentLocation = (): LocationEntry<Action> => {
    const location = (this.api as Api<Action>).getLocation()
    return location.entries[location.index]
  }

  _getLocationInHistory = (n: number): LocationEntry<Action> | undefined => {
    const location = (this.api as Api<Action>).getLocation()
    return location.entries[location.index + n]
  }

  _init = (api: Api<Action>): void => {
    if (this.api) {
      return
    }
    this.api = api
    this.behavior = new ScrollBehavior<LocationEntry<Action>, Request<Action>, never>({
      addTransitionHook: (hook: TransitionHook) => {
        const hookIndex = this.nextHookIndex
        this.nextHookIndex += 1
        this.transitionHooks[hookIndex] = hook
        return () => {
          delete this.transitionHooks[hookIndex]
        }
      },
      stateStorage: {
        save: this.saveScrollPosition,
        read: this.readScrollPosition,
      },
      getCurrentLocation: () => this._getCurrentLocation(),
      shouldUpdateScroll: (request) => {
        if (!this.options.shouldUpdateScroll) {
          return true; // default behaviour
        }
        // The current entry is always available
        const requested = this.options.shouldUpdateScroll(request)
        if (typeof requested === 'number') {
          const entryToRestore = this._getLocationInHistory(requested)
          return entryToRestore ? this.readScrollPosition(entryToRestore, null) || true : true
        }
        return requested
      },
    })
  }

  saveScroll: Middleware<DispatchedAction<Action>> = (api: Api<DispatchedAction<Action>>) => {
    if (isServer()) {
      return (_request, next) => next()
    }
    this._init(api)
    return (request, next) => {
      this.lastRequest = request
      const { action: { location: { prev } } } = request
      if (!prev) {
        // If there is no previous location, there is no position to save
        return next()
      }
      Object.keys(this.transitionHooks).forEach((hookIndex) => {
        this.transitionHooks[hookIndex]()
      })
      return next()
    }
  }

  restoreScroll: Middleware<Action> = (api: Api<Action>) => {
    if (isServer()) {
      return (_request, next) => next()
    }
    this._init(api)
    return (request, next) => {
      if (!this.behavior) {
        throw Error(
          'Cannot call restoreScroll before initialising restoreScroll or saveScroll middlewares',
        )
      }
      this.behavior.updateScroll(request)
      return next()
    }
  }

  updateScroll = (): void => {
    if (!this.behavior) {
      throw Error(
        'Cannot call updateScroll before initialising restoreScroll or saveScroll middlewares',
      )
    }
    this.behavior.updateScroll(this.lastRequest)
  }
}
