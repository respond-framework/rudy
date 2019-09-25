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
} from '@respond-framework/rudy/src/typescript-types'

export type ShouldUpdateScroll<Action extends FluxStandardRoutingAction> =
  (prevEntry?: LocationEntry<Action>, entry?: LocationEntry<Action>) => string | boolean | number | [number, number]

export type RestoreScrollOptions<Action extends FluxStandardRoutingAction> = {
  shouldUpdateScroll?: ShouldUpdateScroll<Action>
}

export default class RestoreScroll<Action extends FluxStandardRoutingAction> {
  options: RestoreScrollOptions<Action>

  behavior?: ScrollBehavior<LocationEntry<Action>, LocationEntry<Action>>

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

  _getLocationInHistory = (n: number): LocationEntry<Action> | undefined => {
    const location = (this.api as Api<Action>).getLocation()
    return location.entries[location.index + n]
  }

  _init = (api: Api<Action>): void => {
    if (this.api) {
      return
    }
    this.api = api
    this.behavior = new ScrollBehavior<LocationEntry<Action>, LocationEntry<Action>>({
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
      getCurrentLocation: () => this._getLocationInHistory(0) as LocationEntry<Action>,
      shouldUpdateScroll: (prevEntry, entry) => {
        if (!this.options.shouldUpdateScroll) {
          return true; // default behaviour
        }
        const requested = this.options.shouldUpdateScroll(prevEntry, entry)
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
    return ({ action: { location: { prev } } }, next) => {
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
    return (_request, next) => {
      ;(this.behavior as ScrollBehavior<LocationEntry<Action>, LocationEntry<Action>>).updateScroll(
        this._getLocationInHistory(-1),
        this._getLocationInHistory(0),
      )
      return next()
    }
  }

  updateScroll = (): void => {
    if (!this.behavior) {
      throw Error(
        'Cannot call updateScroll before initialising restoreScroll or saveScroll middlewares',
      )
    }
    this.behavior.updateScroll(
      this._getLocationInHistory(0),
      this._getLocationInHistory(0),
    )
  }
}
