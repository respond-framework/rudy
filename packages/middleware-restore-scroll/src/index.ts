/* eslint-env browser */
import ScrollBehavior, {
  TransitionHook,
  ShouldUpdateScroll,
} from 'scroll-behavior'
import { isServer } from '@respond-framework/utils'
import {
  Api,
  Middleware,
  Location,
} from '@respond-framework/rudy/src/typescript-types'

type RestoreScrollOptions = {
  shouldUpdateScroll?: ShouldUpdateScroll<Location>
}

export default class RestoreScroll {
  options: RestoreScrollOptions

  behavior?: ScrollBehavior<Location, Location>

  api?: Api

  transitionHooks: { [index: string]: TransitionHook } = {}

  nextHookIndex = 0

  static _makeStorageKey = (
    location: Location | null,
    scrollBehaviorKey: string | null,
  ): string =>
    `@@rudy-restore-scroll/${
      location ? `${location.key}/` : ``
    }${JSON.stringify(scrollBehaviorKey)}`

  constructor(options: RestoreScrollOptions = {}) {
    this.options = options
  }

  _getCurrentLocation = (): Location => {
    return (this.api as Api).getLocation()
  }

  _getPrevLocation = (): Location | undefined => {
    return (this.api as Api).getLocation()
  }

  _init = (api: Api): void => {
    if (this.api) {
      return
    }
    this.api = api
    this.behavior = new ScrollBehavior<Location, Location>({
      addTransitionHook: (hook: TransitionHook) => {
        const hookIndex = this.nextHookIndex
        this.nextHookIndex += 1
        this.transitionHooks[hookIndex] = hook
        return () => {
          delete this.transitionHooks[hookIndex]
        }
      },
      stateStorage: {
        save: (location, key, value) => {
          window.sessionStorage.setItem(
            RestoreScroll._makeStorageKey(location, key),
            JSON.stringify(value),
          )
        },
        read: (location, key) => {
          const savedItem = window.sessionStorage.getItem(
            RestoreScroll._makeStorageKey(location, key),
          )
          if (savedItem === null) {
            return null
          }
          try {
            return JSON.parse(savedItem)
          } catch {
            return null
          }
        },
      },
      getCurrentLocation: () => this._getCurrentLocation(),
      shouldUpdateScroll: this.options.shouldUpdateScroll,
    })
  }

  saveScroll: Middleware = (api: Api) => {
    if (isServer()) {
      return (_request, next) => next()
    }
    this._init(api)
    return (_request, next) => {
      Object.keys(this.transitionHooks).forEach((hookIndex) => {
        this.transitionHooks[hookIndex]()
      })
      return next()
    }
  }

  restoreScroll: Middleware = (api: Api) => {
    if (isServer()) {
      return (_request, next) => next()
    }
    this._init(api)
    return (_request, next) => {
      ;(this.behavior as ScrollBehavior<Location, Location>).updateScroll(
        this._getPrevLocation(),
        this._getCurrentLocation(),
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
      this._getCurrentLocation(),
      this._getCurrentLocation(),
    )
  }
}
