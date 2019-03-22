import actionToUrl from './actionToUrl'

describe('Serializes params', () => {
  const NOT_FOUND = 'NOT_FOUND'
  const ROOT = 'ROOT'
  const STATIC = 'STATIC'
  const SINGLE_PARAM = 'SINGLE_PARAM'
  const OPTIONAL_PARAM = 'OPTIONAL_PARAM'
  const MULTIPLE_PARAMS = 'MULTIPLE_PARAMS'
  const OPTIONAL_PATH_PARAM = 'OPTIONAL_PATH_PARAM'
  const COMPULSORY_PATH_PARAM = 'COMPULSORY_PATH_PARAM'
  const MULTI_MULTI_PARAM = 'MULTI_MULTI_PARAM'
  const routes = {
    [NOT_FOUND]: {
      path: '/404',
    },
    [ROOT]: {
      path: '',
    },
    [STATIC]: {
      path: '/static',
    },
    [SINGLE_PARAM]: {
      path: '/compulsory/:param',
    },
    [OPTIONAL_PARAM]: {
      path: '/optional/:param?',
    },
    [MULTIPLE_PARAMS]: {
      path: '/multiple/:p1/:p2',
    },
    [OPTIONAL_PATH_PARAM]: {
      path: '/multistar/:p*',
    },
    [COMPULSORY_PATH_PARAM]: {
      path: '/multiplus/:p+',
    },
    [MULTI_MULTI_PARAM]: {
      path: '/multimulti/:p1*/separator/:p2+',
    },
  }
  const api = {
    routes,
    options: {},
  }
  const assertUrlForAction = (action, url) =>
    expect(actionToUrl(action, api, {})).toEqual({
      url,
      state: {},
    })

  it('Static path', () => {
    /**
     * TODO the route regex doesn't have a trailing slash, so this
     * generated URL also should not!
     */
    assertUrlForAction({ type: ROOT }, '/')
    assertUrlForAction({ type: STATIC }, '/static')
  })

  it('Single compulsory parameter', () => {
    assertUrlForAction({ type: SINGLE_PARAM }, '/404')

    assertUrlForAction(
      { type: SINGLE_PARAM, params: { param: null } },
      '/404',
    )

    assertUrlForAction(
      { type: SINGLE_PARAM, params: { param: undefined } },
      '/404',
    )

    assertUrlForAction(
      { type: SINGLE_PARAM, params: { param: 'apple' } },
      '/compulsory/apple',
    )
  })

  it('Single optional parameter', () => {
    assertUrlForAction({ type: OPTIONAL_PARAM }, '/optional')

    assertUrlForAction(
      { type: OPTIONAL_PARAM, params: { param: null } },
      '/optional',
    )

    assertUrlForAction(
      { type: OPTIONAL_PARAM, params: { param: undefined } },
      '/optional',
    )

    assertUrlForAction(
      { type: OPTIONAL_PARAM, params: { param: 'test' } },
      '/optional/test',
    )
  })

  it('Multiple parameters', () => {
    assertUrlForAction({ type: MULTIPLE_PARAMS, params: {} }, '/404')

    assertUrlForAction({ type: MULTIPLE_PARAMS, params: { p1: 1 } }, '/404')

    assertUrlForAction(
      { type: MULTIPLE_PARAMS, params: { p1: 1, p2: 2 } },
      '/multiple/1/2',
    )
  })

  it('Multi segment optional parameter', () => {
    assertUrlForAction({ type: OPTIONAL_PATH_PARAM }, '/multistar')

    assertUrlForAction(
      { type: OPTIONAL_PATH_PARAM, params: { p: undefined } },
      '/multistar',
    )

    assertUrlForAction(
      { type: OPTIONAL_PATH_PARAM, params: { p: null } },
      '/multistar',
    )

    assertUrlForAction(
      { type: OPTIONAL_PATH_PARAM, params: { p: '' } },
      '/multistar',
    )

    assertUrlForAction(
      { type: OPTIONAL_PATH_PARAM, params: { p: 'single' } },
      '/multistar/single',
    )

    assertUrlForAction(
      { type: OPTIONAL_PATH_PARAM, params: { p: 'one/two/three' } },
      '/multistar/one/two/three',
    )
  })

  it('Multi segment compulsory parameter', () => {
    assertUrlForAction(
      { type: COMPULSORY_PATH_PARAM, params: { p: undefined } },
      '/404',
    )

    assertUrlForAction(
      { type: COMPULSORY_PATH_PARAM, params: { p: null } },
      '/404',
    )

    assertUrlForAction(
      { type: COMPULSORY_PATH_PARAM, params: { p: '' } },
      '/404',
    )

    assertUrlForAction(
      { type: COMPULSORY_PATH_PARAM, params: { p: 'one' } },
      '/multiplus/one',
    )

    assertUrlForAction(
      { type: COMPULSORY_PATH_PARAM, params: { p: 'one/two' } },
      '/multiplus/one/two',
    )
  })

  it('Multiple multi segment params', () => {
    assertUrlForAction({ type: MULTI_MULTI_PARAM, params: {} }, '/404')

    assertUrlForAction(
      { type: MULTI_MULTI_PARAM, params: { p1: 'one' } },
      '/404',
    )

    assertUrlForAction(
      { type: MULTI_MULTI_PARAM, params: { p2: 'one' } },
      '/multimulti/separator/one',
    )

    assertUrlForAction(
      { type: MULTI_MULTI_PARAM, params: { p2: 'one/two' } },
      '/multimulti/separator/one/two',
    )

    assertUrlForAction(
      {
        type: MULTI_MULTI_PARAM,
        params: { p1: 'one/two', p2: 'three/four' },
      },
      '/multimulti/one/two/separator/three/four',
    )
  })
})
