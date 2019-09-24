declare module 'scroll-behavior' {
  export type TransitionHook = () => void

  export type ScrollPosition = [number, number]

  export type ScrollTarget = string | ScrollPosition

  export type ShouldUpdateScroll<Context> = (
    prevContext?: Context,
    context?: Context,
  ) => ScrollTarget | true | false

  type ScrollBehaviorArgs<Loc extends { hash?: string, action?: 'PUSH' | string }, Context> = {
    addTransitionHook: (hook: TransitionHook) => () => void
    stateStorage: {
      save: (location: Loc, key: string | null, value: ScrollPosition) => void
      read: (location: Loc, key: string | null) => ScrollPosition | null
    }
    getCurrentLocation: () => Loc
    shouldUpdateScroll?: ShouldUpdateScroll<Context>
  }

  export default class ScrollBehavior<Loc = Location, Context = Location> {
    constructor(options: ScrollBehaviorArgs<Loc, Context>)

    updateScroll: (prevContext?: Context, context?: Context) => void

    registerElement: (
      key: string,
      element: HTMLElement,
      shouldUpdateScroll: ShouldUpdateScroll<Context>,
      context: Context,
    ) => void

    unregisterElement: (key: string) => void

    scrollToTarget: (element: HTMLElement, target: ScrollTarget) => void
  }
}
