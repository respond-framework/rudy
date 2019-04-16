// @flow
import urlToAction, { defaultFromPath } from './urlToAction'
import { notFound } from '../actions'

describe('Parses params', () => {
  const NOT_FOUND = 'NOT_FOUND'
  const ROOT = 'ROOT'
  const STATIC = 'STATIC'
  const UNNAMED_PARAM = 'UNNAMED_PARAM'
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
    [UNNAMED_PARAM]: {
      path: '/unnamed(.*)',
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

  it('Not found path', () => {
    assertActionForUrl('/doesnotexist', notFound())
  })

  it('Static path', () => {
    assertActionForUrl('/', { type: ROOT })

    assertActionForUrl('/static', { type: STATIC })
  })

  it('Single unnamed parameter', () => {
    assertActionForUrl('/unnamed', {
      type: UNNAMED_PARAM,
      params: { '0': '' },
    })

    assertActionForUrl('/unnamedapple', {
      type: UNNAMED_PARAM,
      params: { '0': 'apple' },
    })
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

describe('defaultFromPath', () => {
  const checkFromPath = (
    value,
    result,
    {
      repeat,
      optional,
      convertNumbers,
      capitalizedWords,
    }: {
      repeat?: boolean,
      optional?: boolean,
      convertNumbers?: boolean,
      capitalizedWords?: boolean,
    } = {},
  ) => {
    let label
    if (value === undefined) {
      label = 'undefined'
    } else if (Array.isArray(value)) {
      label = '[Array]'
    } else if (typeof value === 'string') {
      label = `'${value}'`
    }

    const repeatValues = [true, false].filter((val) => !val !== repeat)
    const optionalValues = [true, false].filter((val) => !val !== optional)
    const convertNumbersValues = [true, false].filter(
      (val) => !val !== convertNumbers,
    )
    const capitalizeWordsValues = [true, false].filter(
      (val) => !val !== capitalizedWords,
    )

    repeatValues.forEach((r) => {
      optionalValues.forEach((o) => {
        capitalizeWordsValues.forEach((w) => {
          convertNumbersValues.forEach((n) =>
            it(`defaultFromPath(${label}, { name: 'test', repeat: ${
              repeat ? 'true' : 'false'
            }, optional: ${optional ? 'true' : 'false'}}, { convertNumbers: ${
              n ? 'true' : 'false'
            }, capitalizedWords: ${w ? 'true' : 'false'} })`, () =>
              expect(
                defaultFromPath(
                  value,
                  { name: 'test', optional: o, repeat: r },
                  { convertNumbers: n, capitalizedWords: w },
                  {},
                ),
              ).toEqual(result)),
          )
        })
      })
    })
  }

  // absent optional  params
  checkFromPath(undefined, undefined, { optional: true, repeat: false })
  checkFromPath([], undefined, { repeat: true, optional: true })

  // strings
  checkFromPath('one%20two-three', 'one%20two-three', {
    repeat: false,
    capitalizedWords: false,
  })
  checkFromPath('42', '42', {
    repeat: false,
    convertNumbers: false,
  })

  // convertNumbers
  checkFromPath('42', 42, {
    repeat: false,
    convertNumbers: true,
  })
  checkFromPath('3.141', 3.141, {
    repeat: false,
    convertNumbers: true,
  })

  // capitalizedWords
  checkFromPath('one-two-three', 'One Two Three', {
    repeat: false,
    capitalizedWords: true,
  })
  checkFromPath('one', 'One', {
    repeat: false,
    capitalizedWords: true,
  })

  // multiple segments
  checkFromPath(['segment1'], 'segment1', { repeat: true })
  checkFromPath(
    ['segment1', 'segment%202', 'segment-three', '42'],
    'segment1/segment%202/segment-three/42',
    { repeat: true },
  )
})
