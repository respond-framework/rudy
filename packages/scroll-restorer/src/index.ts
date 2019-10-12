/* eslint-env browser */
import ScrollBehavior, {
  TransitionHook,
  ScrollPosition,
  ScrollTarget,
} from 'scroll-behavior'
import {
  Api,
  Middleware,
  LocationEntry,
  FluxStandardRoutingAction,
  Request,
  ScrollRestorer,
  ScrollRestorerCreator,
} from '@respond-framework/types'

export { ScrollPosition } from 'scroll-behavior'

export type ShouldUpdateScroll<Action extends FluxStandardRoutingAction> = (
  request: Request<Action>,
) => ScrollTarget

export type RestoreScrollOptions<Action extends FluxStandardRoutingAction> = {
  shouldUpdateScroll?: ShouldUpdateScroll<Action>
}

type Location<Action extends FluxStandardRoutingAction> = LocationEntry<
  Action
> & {
  action: 'unknown'
}

export class RudyScrollRestorer<Action extends FluxStandardRoutingAction>
  implements ScrollRestorer<Action> {
  private options: RestoreScrollOptions<Action>

  private behavior: ScrollBehavior<Location<Action>, Request<Action>>

  private lastRequest?: Request<Action>

  private api: Api<Action>

  private transitionHooks: { [index: string]: TransitionHook } = {}

  private nextHookIndex = 0

  private makeStorageKey = (
    entry: LocationEntry<Action> | null,
    scrollBehaviorKey: string | null,
  ): string =>
    `@@rudy-restore-scroll/${
      entry ? `${entry.location.key}/` : ``
    }${JSON.stringify(scrollBehaviorKey)}`

  private saveScrollPosition = (
    entry: LocationEntry<Action>,
    key: string | null,
    value: ScrollPosition,
  ): void => {
    window.sessionStorage.setItem(
      this.makeStorageKey(entry, key),
      JSON.stringify(value),
    )
  }

  readScrollPosition = (
    entry: LocationEntry<Action>,
    key: string | null,
  ): ScrollPosition | null => {
    const savedItem = window.sessionStorage.getItem(
      this.makeStorageKey(entry, key),
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

  constructor(api: Api<Action>, options: RestoreScrollOptions<Action> = {}) {
    this.api = api
    this.options = options
    this.behavior = new ScrollBehavior<Location<Action>, Request<Action>>({
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
      getCurrentLocation: () => this.getCurrentLocation(),
      shouldUpdateScroll: (_, request) => {
        if (!this.options.shouldUpdateScroll) {
          return true // default behaviour
        }
        return this.options.shouldUpdateScroll(request)
      },
    })
  }

  private getCurrentLocation = (): Location<Action> => {
    const location = this.api.getLocation()
    return {
      ...location.entries[location.index],
      action: 'unknown',
    }
  }

  saveScroll: Middleware<Action> = () => {
    return (request, next) => {
      this.lastRequest = request
      const { action } = request
      if (!('location' in action && action.location.prev)) {
        // If there is no previous location, there is no position to save
        return next()
      }
      Object.keys(this.transitionHooks).forEach((hookIndex) => {
        this.transitionHooks[hookIndex]()
      })
      return next()
    }
  }

  restoreScroll: Middleware<Action> = () => {
    return (request, next) => {
      this.behavior.updateScroll(null, request)
      return next()
    }
  }

  updateScroll = (): void => {
    if (this.lastRequest) {
      this.behavior.updateScroll(null, this.lastRequest)
    }
  }
}

export default <Action extends FluxStandardRoutingAction>(
  options?: RestoreScrollOptions<Action>,
): ScrollRestorerCreator<Action> => (api) =>
  new RudyScrollRestorer(api, options)
