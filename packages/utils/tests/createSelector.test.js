import createSelector from '../src/createSelector'

describe('createSelector', () => {
  test('Returns undefined if the state is undefined', async () => {
    const selector = createSelector('test name')
    expect(selector()).toStrictEqual(undefined)
  })

  test('Returns undefined if the state is null', async () => {
    const selector = createSelector('test name')
    expect(selector(null)).toStrictEqual(undefined)
  })

  test('Returns the key for the name if no key/selector is provided', async () => {
    const selector = createSelector('test name')
    expect(
      selector({
        'test name': 'test value',
      }),
    ).toStrictEqual('test value')
  })

  test('Returns the given key if a string is provided', async () => {
    const selector = createSelector('test name', 'test key')
    expect(
      selector({
        'test name': 'test value',
        'test key': 'test keyed value',
      }),
    ).toStrictEqual('test keyed value')
  })

  test('Uses a selector if provided', async () => {
    const state = {
      'test name': 'test value',
      'test key': 'test keyed value',
    }
    const providedSelector = jest.fn(() => 'selector return value')
    const selector = createSelector('test name', providedSelector)
    const result = selector(state)
    expect(result).toStrictEqual('selector return value')
    expect(providedSelector).toHaveBeenCalledTimes(1)
    expect(providedSelector).toHaveBeenCalledWith(state)
  })
})
