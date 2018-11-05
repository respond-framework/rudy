import isServer from '../src/isServer'

describe('isServer', () => {
  test('Returns true when window is not defined', async () => {
    expect(isServer()).toStrictEqual(true)
    expect(global.window).toBeUndefined()
  })

  test('Returns true when window.document is not defined', async () => {
    global.window = {}
    expect(isServer()).toStrictEqual(true)
    expect(global.window.document).toBeUndefined()
  })

  test('Returns true when window.document.createElement is not defined', async () => {
    global.window = {
      document: {},
    }
    expect(isServer()).toStrictEqual(true)
    expect(global.window.document.createElement).toBeUndefined()
  })

  test('Returns false when window.document.createElement is defined', async () => {
    global.window = {
      document: {
        createElement: true,
      },
    }
    expect(isServer()).toStrictEqual(false)
    expect(global.window.document.createElement).toStrictEqual(true)
  })
})
