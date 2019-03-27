import urlToAction from './urlToAction'

describe('Parses params', () => {
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
      path: '/',
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

  const assertActionForUrl = (url, action) =>
    expect(urlToAction(api, url, {})).toEqual({
      basename: '',
      hash: '',
      location: {
        key: '345678',
        pathname: url,
        scene: '',
        search: '',
        url,
      },
      query: {},
      state: {},
      params: {},
      ...action,
    })

  it('Static path', () => {
    assertActionForUrl('/', { type: ROOT })

    assertActionForUrl('/static', { type: STATIC })
  })

  it('Single compulsory parameter', () => {
    assertActionForUrl('/compulsory', { type: NOT_FOUND })

    assertActionForUrl('/compulsory/apple', {
      type: SINGLE_PARAM,
      params: { param: 'apple' },
    })
  })

  it('Single optional parameter', () => {
    assertActionForUrl('/optional', { type: OPTIONAL_PARAM })

    assertActionForUrl('/optional/test', {
      type: OPTIONAL_PARAM,
      params: { param: 'test' },
    })
  })

  it('Multiple parameters', () => {
    assertActionForUrl('/multiple/1/2', {
      type: MULTIPLE_PARAMS,
      params: { p1: '1', p2: '2' },
    })
  })

  it('Multi segment optional parameter', () => {
    assertActionForUrl('/multistar', { type: OPTIONAL_PATH_PARAM })

    assertActionForUrl('/multistar/single', {
      type: OPTIONAL_PATH_PARAM,
      params: { p: 'single' },
    })

    assertActionForUrl('/multistar/one/two/three', {
      type: OPTIONAL_PATH_PARAM,
      params: { p: 'one/two/three' },
    })
  })

  it('Multi segment compulsory parameter', () => {
    assertActionForUrl('/multiplus', { type: NOT_FOUND })

    assertActionForUrl('/multiplus/one', {
      type: COMPULSORY_PATH_PARAM,
      params: { p: 'one' },
    })

    assertActionForUrl('/multiplus/one/two', {
      type: COMPULSORY_PATH_PARAM,
      params: { p: 'one/two' },
    })
  })

  it('Multiple multi segment params', () => {
    assertActionForUrl('/multimulti/separator/one', {
      type: MULTI_MULTI_PARAM,
      params: { p2: 'one' },
    })

    assertActionForUrl('/multimulti/separator/one/two', {
      type: MULTI_MULTI_PARAM,
      params: { p2: 'one/two' },
    })

    assertActionForUrl('/multimulti/one/two/separator/three/four', {
      type: MULTI_MULTI_PARAM,
      params: { p1: 'one/two', p2: 'three/four' },
    })
  })
})
