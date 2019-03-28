import { locationToUrl } from '@respond-framework/rudy/utils'
import { replace } from '@respond-framework/rudy/actions'
import createTest from '../../../../__helpers__/createTest'

createTest(
  'set(action, n)',
  {
    FIRST: '/',
    SECOND: '/second',
    THIRD: '/third',
    FOURTH: '/fourth',
  },
  {
    testBrowser: true,
  },
  [],
  async ({ snap, dispatch }) => {
    expect(locationToUrl(window.location)).toEqual('/')

    await snap(replace('/second', { foo: 'bar' }))
    expect(locationToUrl(window.location)).toEqual('/second')

    await dispatch({ type: 'THIRD' })

    await snap(replace('/fourth', { hey: 'yo' }))
    expect(locationToUrl(window.location)).toEqual('/fourth')
  },
)
