// @flow
import actionToUrl, { defaultToPath } from './actionToUrl'

describe('Serializes params', () => {
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
    options: {
      toPath: (val) => val,
      fromPath: (val) => val,
    },
  }
  const assertUrlForAction = (action, url) =>
    expect(actionToUrl(action, api)).toEqual({
      url,
      state: {},
    })

  const assertErrorForAction = (action) =>
    expect(() => actionToUrl(action, api)).toThrow()

  it('Static path', () => {
    assertUrlForAction({ type: ROOT }, '/')
    assertUrlForAction({ type: STATIC }, '/static')
  })

  it('Single compulsory unnamed parameter', () => {
    assertErrorForAction({ type: UNNAMED_PARAM })

    assertErrorForAction({ type: UNNAMED_PARAM, params: { '0': null } })

    assertErrorForAction({ type: UNNAMED_PARAM, params: { '0': undefined } })

    assertUrlForAction({ type: UNNAMED_PARAM, params: { '0': '' } }, '/unnamed')

    assertUrlForAction(
      { type: UNNAMED_PARAM, params: { '0': 'apple' } },
      '/unnamedapple',
    )
  })

  it('Single compulsory parameter', () => {
    assertErrorForAction({ type: SINGLE_PARAM })

    assertErrorForAction({ type: SINGLE_PARAM, params: { param: null } })

    assertErrorForAction({ type: SINGLE_PARAM, params: { param: undefined } })

    assertErrorForAction({ type: SINGLE_PARAM, params: { param: '' } })

    assertUrlForAction(
      { type: SINGLE_PARAM, params: { param: 'apple' } },
      '/compulsory/apple',
    )
  })

  it('Single optional parameter', () => {
    assertUrlForAction({ type: OPTIONAL_PARAM }, '/optional')

    assertErrorForAction({ type: OPTIONAL_PARAM, params: { param: null } })

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
    assertErrorForAction({ type: MULTIPLE_PARAMS, params: {} })

    assertErrorForAction({ type: MULTIPLE_PARAMS, params: { p1: '1' } })

    assertUrlForAction(
      { type: MULTIPLE_PARAMS, params: { p1: '1', p2: '2' } },
      '/multiple/1/2',
    )
  })

  it('Multi segment optional parameter', () => {
    assertUrlForAction({ type: OPTIONAL_PATH_PARAM }, '/multistar')

    assertErrorForAction({
      type: OPTIONAL_PATH_PARAM,
      params: { p: undefined },
    })

    assertErrorForAction({ type: OPTIONAL_PATH_PARAM, params: { p: null } })

    assertErrorForAction({ type: OPTIONAL_PATH_PARAM, params: { p: '' } })

    assertUrlForAction(
      { type: OPTIONAL_PATH_PARAM, params: { p: [] } },
      '/multistar',
    )

    assertUrlForAction(
      { type: OPTIONAL_PATH_PARAM, params: { p: ['single'] } },
      '/multistar/single',
    )

    assertUrlForAction(
      { type: OPTIONAL_PATH_PARAM, params: { p: ['one', 'two', 'three'] } },
      '/multistar/one/two/three',
    )
  })

  it('Multi segment compulsory parameter', () => {
    assertErrorForAction({
      type: COMPULSORY_PATH_PARAM,
      params: { p: undefined },
    })

    assertErrorForAction({ type: COMPULSORY_PATH_PARAM, params: { p: null } })

    assertErrorForAction({ type: COMPULSORY_PATH_PARAM, params: { p: [] } })

    assertUrlForAction(
      { type: COMPULSORY_PATH_PARAM, params: { p: ['one'] } },
      '/multiplus/one',
    )

    assertUrlForAction(
      { type: COMPULSORY_PATH_PARAM, params: { p: ['one', 'two'] } },
      '/multiplus/one/two',
    )
  })

  it('Multiple multi segment params', () => {
    assertErrorForAction({ type: MULTI_MULTI_PARAM, params: {} })

    assertErrorForAction({ type: MULTI_MULTI_PARAM, params: { p1: 'one' } })

    assertUrlForAction(
      { type: MULTI_MULTI_PARAM, params: { p2: ['one'] } },
      '/multimulti/separator/one',
    )

    assertUrlForAction(
      { type: MULTI_MULTI_PARAM, params: { p2: ['one', 'two'] } },
      '/multimulti/separator/one/two',
    )

    assertUrlForAction(
      {
        type: MULTI_MULTI_PARAM,
        params: { p1: ['one', 'two'], p2: ['three', 'four'] },
      },
      '/multimulti/one/two/separator/three/four',
    )
  })
})

describe('defaultToPath', () => {
  const checkToPath = (
    succeed = true,
    value,
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
    result,
  ) => {
    let label
    if (value === undefined) {
      label = 'undefined'
    } else if (value === null) {
      label = 'null'
    } else if (Array.isArray(value)) {
      label = '[Array]'
    } else if (typeof value === 'object') {
      label = '{Object}'
    } else if (typeof value === 'string') {
      label = `'${value}'`
    } else if (typeof value === 'number') {
      label = value.toString()
    } else {
      label = '<unknown>'
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
            it(`defaultToPath(${label}, { name: 'test', repeat: ${
              repeat ? 'true' : 'false'
            }, optional: ${optional ? 'true' : 'false'} }, { convertNumbers: ${
              n ? 'true' : 'false'
            }, capitalizedWords: ${w ? 'true' : 'false'} })`, () =>
              succeed
                ? expect(
                    defaultToPath(
                      value,
                      { name: 'test', optional: o, repeat: r },
                      { convertNumbers: n, capitalizedWords: w },
                      {},
                    ),
                  ).toEqual(result)
                : expect(() =>
                    defaultToPath(
                      value,
                      { name: 'test', optional: o, repeat: r },
                      { convertNumbers: n, capitalizedWords: w },
                      {},
                    ),
                  ).toThrow()),
          )
        })
      })
    })
  }

  // undefined allowed for optional params
  checkToPath(true, undefined, { optional: true, repeat: true }, [])
  checkToPath(true, undefined, { optional: true, repeat: false }, undefined)
  checkToPath(false, undefined, { optional: false })

  // Values never allowed (they would break the symmetry of fromPath/toPath)
  checkToPath(false, '', { repeat: true })
  checkToPath(false, '', { repeat: false, optional: true })
  checkToPath(false, null)
  checkToPath(false, true)
  checkToPath(false, false)
  checkToPath(false, [])
  checkToPath(false, {})

  // convertNumbers
  checkToPath(false, 0, { repeat: true })
  checkToPath(false, 0, { convertNumbers: false })
  checkToPath(true, 0, { repeat: false, convertNumbers: true }, '0')
  checkToPath(true, 1, { repeat: false, convertNumbers: true }, '1')
  checkToPath(true, 3.141, { repeat: false, convertNumbers: true }, '3.141')

  // Strings
  checkToPath(true, 'simple', { repeat: false }, 'simple')
  checkToPath(true, 'simple', { repeat: true }, ['simple'])
  checkToPath(true, 'path/param', { repeat: false }, 'path/param')
  checkToPath(true, 'path/param', { repeat: true }, ['path', 'param'])
  checkToPath(true, 'path%2fparam', { repeat: false }, 'path%2fparam')
  checkToPath(true, 'path%2fparam', { repeat: true }, ['path%2fparam'])

  // capitalizedWords
  checkToPath(
    true,
    'Daniel Playfair Cal',
    { capitalizedWords: true, repeat: false },
    'daniel-playfair-cal',
  )
  checkToPath(
    true,
    'Daniel Playfair Cal',
    { capitalizedWords: false, repeat: false },
    'Daniel Playfair Cal',
  )
  checkToPath(true, 'Daniel Playfair Cal', { repeat: true }, [
    'Daniel Playfair Cal',
  ])
})
