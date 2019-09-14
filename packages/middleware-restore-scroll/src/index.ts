/* eslint-env browser */
import ScrollBehavior from 'scroll-behavior'
import { isServer } from '@respond-framework/utils'

interface RestoreScrollOptions {}

export default (options: RestoreScrollOptions) => {
  let scrollState
  const getScrollBehavior = (api) => {
    if (!scrollState) {
      scrollState = createScrollBehavior(api, options)
    }
    return scrollState
  }

  return {
    saveScroll: (api) => {
      if (isServer()) {
        return (request, next) => next()
      }
      const scrollState = getScrollBehavior(api)
      return (request, next) => {
        Object.keys(scrollState.transitionHooks).forEach((hookIndex) => {
          scrollState.transitionHooks[hookIndex]()
        })
        return next()
      }
    },

    restoreScroll: (api) => {
      if (isServer()) {
        return (request, next) => next()
      }
      const scrollState = getScrollBehavior(api)
      return (request, next) => {
        scrollState.behavior.updateScroll()
        next()
      }
    },

    updateScroll: () => {
      if (!scrollState) {
        throw Error(
          'Cannot call restoreScroll befire initialising middlewareSaveScroll or middlewareRestoreScroll',
        )
      }
      scrollState.behavior.updateScroll()
    },
  }
}

const createScrollBehavior = (api, options) => {
  const transitionHooks = {}
  let nextHookIndex = 0
  return {
    transitionHooks,
    behavior: new ScrollBehavior({
      addTransitionHook: (hook) => {
        const hookIndex = nextHookIndex
        nextHookIndex += 1
        transitionHooks[hookIndex] = hook
        return () => {
          delete transitionHooks[hookIndex]
        }
      },
      stateStorage: {
        save: (location, key, value) => {
          window.sessionStorage.setItem(
            makeStorageKey(location, key),
            JSON.stringify(value),
          )
        },
        read: (location, key) => {
          const savedItem = window.sessionStorage.getItem(
            makeStorageKey(location, key),
          )
          try {
            return JSON.parse(savedItem)
          } catch {
            return null
          }
        },
      },
      getCurrentLocation: () => api.getLocation().key,
    }),
  }
}

const makeStorageKey = (
  locationKey: string,
  scrollBehaviorKey: string | null,
) => `@@rudy-restore-scroll/${locationKey}/${JSON.stringify(scrollBehaviorKey)}`
