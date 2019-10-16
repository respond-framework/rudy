import { get } from '@respond-framework/rudy/history/utils/sessionStorage'
import createTest, { setupStore } from '../../../../__helpers__/createTest'

beforeAll(async () => {
  const routesMap = {
    FIRST: '/',
    SECOND: '/second',
    THIRD: '/third',
  }

  const { store, firstRoute, history } = setupStore(routesMap)

  const firstAction = firstRoute(false)
  await store.dispatch(firstAction)

  await store.dispatch({ type: 'SECOND' })
  await store.dispatch({ type: 'THIRD' })
  await history.back() // go back, so we can simulate leaving in the middle of the stack

  history.unlisten()
})

createTest(
  'restore history when index > 0',
  {
    FIRST: '/',
    SECOND: '/second',
    THIRD: '/third',
  },
  { testBrowser: true },
  [],
  async ({ snapPop, getLocation }) => {
    expect(getLocation()).toMatchSnapshot()
    expect(get()).toMatchSnapshot()

    await snapPop('back')

    expect(getLocation().type).toEqual('FIRST')
    expect(window.location.pathname).toEqual('/')

    expect(getLocation().index).toEqual(0)

    // although we left in the middle of the entries (at SECOND),
    // THIRD will still be present on return, since in a real browser
    // there is no reliable way to distinguish between these histories
    //  1. FIRST -> SECOND -> THIRD -> SECOND(back button) -> google.com -> SECOND(back button)
    //  2. FIRST -> SECOND -> THIRD -> google.com -> SECOND(right click back button, back 2 steps)
    expect(getLocation().length).toEqual(3)

    expect(get()).toMatchSnapshot()
  },
)
