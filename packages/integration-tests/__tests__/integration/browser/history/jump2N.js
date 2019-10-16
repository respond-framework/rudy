import { locationToUrl } from '@respond-framework/rudy/utils'
import { jump } from '@respond-framework/rudy/actions'
import createTest, { resetBrowser } from '../../../../__helpers__/createTest'
import { windowHistoryGo } from '../../../../__helpers__/awaitUrlChange'

beforeEach(resetBrowser)

createTest(
  'set(action, n)',
  {
    SECOND: '/second',
    THIRD: '/third',
    FIRST: '/:foo?',
  },
  {
    testBrowser: true,
  },
  [],
  async ({ dispatch, snap, snapPop }) => {
    expect(locationToUrl(window.location)).toEqual('/')

    await dispatch({ type: 'SECOND' })
    await dispatch({ type: 'THIRD' })

    expect(locationToUrl(window.location)).toEqual('/third')

    await snap(jump(-2))

    expect(locationToUrl(window.location)).toEqual('/')

    await snapPop('forward')
    expect(locationToUrl(window.location)).toEqual('/second')

    await snapPop('back')

    await dispatch(jump(2))
    expect(locationToUrl(window.location)).toEqual('/third')
  },
)

createTest(
  'history.go(n)',
  {
    SECOND: '/second',
    THIRD: '/third',
    FIRST: '/:foo?',
  },
  {
    testBrowser: true,
  },
  [],
  async ({ dispatch, snap }) => {
    expect(locationToUrl(window.location)).toEqual('/')

    await dispatch({ type: 'SECOND' })
    await dispatch({ type: 'THIRD' })

    expect(locationToUrl(window.location)).toEqual('/third')

    // This simulates what happens if the user right clicks on the back
    // button, and goes back by two steps
    await windowHistoryGo(-2)
    expect(locationToUrl(window.location)).toEqual('/')
    await snap()

    await windowHistoryGo(1)
    expect(locationToUrl(window.location)).toEqual('/second')
    await snap()

    await windowHistoryGo(-1)
    expect(locationToUrl(window.location)).toEqual('/')
    await snap()

    await windowHistoryGo(2)
    expect(locationToUrl(window.location)).toEqual('/third')
    await snap()
  },
)
