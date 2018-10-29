import changePageTitle from '../src'

describe('Changes the page title correctly', () => {
  test('Does default behaviour with no options', async () => {
    /**
     * The mocks don't get passed here, but since the tests are run
     * in the jest node environment, isServer by default returns true,
     * and the test would fail if the middleware
     * incorrectly attempted to set the title, since `window` would be
     * undefined
     */
    const creator = changePageTitle()
    const api = {
      getState: jest.fn(() => ({ title: 'Test Title' })),
    }
    const middleware = creator(api)
    expect(api.getState).not.toHaveBeenCalled()
    const request = {}
    const next = jest.fn(() => 'nextvalue')
    const result = await middleware(request, next)
    expect(api.getState).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledTimes(1)
    expect(result).toEqual('nextvalue')
  })

  test('Sets the title in the browser', async () => {
    const setTitle = jest.fn()
    const selectTitle = jest.fn(() => 'Test Title')
    const createSelector = jest.fn(() => selectTitle)
    const creator = changePageTitle({
      isServer: () => false,
      setTitle,
      createSelector,
    })
    const api = {
      getState: jest.fn(() => 'test state'),
    }
    const middleware = creator(api)
    expect(createSelector).toHaveBeenCalledTimes(1)
    expect(createSelector).toHaveBeenCalledWith('title', undefined)
    expect(api.getState).not.toHaveBeenCalled()
    expect(selectTitle).not.toHaveBeenCalled()
    expect(setTitle).not.toHaveBeenCalled()
    const request = {}
    const next = jest.fn(() => 'nextvalue')
    const result = await middleware(request, next)
    expect(api.getState).toHaveBeenCalledTimes(1)
    expect(api.getState).toHaveBeenCalledWith()
    expect(createSelector).toHaveBeenCalledTimes(1)
    expect(selectTitle).toHaveBeenCalledTimes(1)
    expect(selectTitle).toHaveBeenCalledWith('test state')
    expect(setTitle).toHaveBeenCalledTimes(1)
    expect(setTitle).toHaveBeenCalledWith('Test Title')
    expect(next).toHaveBeenCalledTimes(1)
    expect(result).toEqual('nextvalue')
  })

  test('Passes through the key/selector option to createSelector', async () => {
    const setTitle = jest.fn()
    const selectTitle = jest.fn(() => 'Test Title')
    const createSelector = jest.fn(() => selectTitle)
    const creator = changePageTitle({
      isServer: () => false,
      title: 'test title',
      setTitle,
      createSelector,
    })
    const api = {
      getState: jest.fn(() => 'test state'),
    }
    const middleware = creator(api)
    expect(createSelector).toHaveBeenCalledTimes(1)
    expect(createSelector).toHaveBeenCalledWith('title', 'test title')
    expect(api.getState).not.toHaveBeenCalled()
    expect(selectTitle).not.toHaveBeenCalled()
    expect(setTitle).not.toHaveBeenCalled()
    const request = {}
    const next = jest.fn(() => 'nextvalue')
    const result = await middleware(request, next)
    expect(api.getState).toHaveBeenCalledTimes(1)
    expect(api.getState).toHaveBeenCalledWith()
    expect(createSelector).toHaveBeenCalledTimes(1)
    expect(selectTitle).toHaveBeenCalledTimes(1)
    expect(selectTitle).toHaveBeenCalledWith('test state')
    expect(setTitle).toHaveBeenCalledTimes(1)
    expect(setTitle).toHaveBeenCalledWith('Test Title')
    expect(next).toHaveBeenCalledTimes(1)
    expect(result).toEqual('nextvalue')
  })

  test('Does not set the title on the server', async () => {
    const setTitle = jest.fn()
    const selectTitle = jest.fn(() => 'Test Title')
    const createSelector = jest.fn(() => selectTitle)
    const creator = changePageTitle({
      isServer: () => true,
      setTitle,
      createSelector,
    })
    const api = {
      getState: jest.fn(() => 'test state'),
    }
    const middleware = creator(api)
    expect(createSelector).toHaveBeenCalledTimes(1)
    expect(createSelector).toHaveBeenCalledWith('title', undefined)
    expect(api.getState).not.toHaveBeenCalled()
    expect(selectTitle).not.toHaveBeenCalled()
    expect(setTitle).not.toHaveBeenCalled()
    const request = {}
    const next = jest.fn(() => 'nextvalue')
    const result = await middleware(request, next)
    expect(api.getState).toHaveBeenCalledTimes(1)
    expect(api.getState).toHaveBeenCalledWith()
    expect(createSelector).toHaveBeenCalledTimes(1)
    expect(selectTitle).toHaveBeenCalledTimes(1)
    expect(selectTitle).toHaveBeenCalledWith('test state')
    expect(setTitle).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
    expect(result).toEqual('nextvalue')
  })

  test('Does not set the title if it is undefined', async () => {
    const setTitle = jest.fn()
    const selectTitle = jest.fn(() => undefined)
    const createSelector = jest.fn(() => selectTitle)
    const creator = changePageTitle({
      isServer: () => false,
      setTitle,
      createSelector,
    })
    const api = {
      getState: jest.fn(() => 'test state'),
    }
    const middleware = creator(api)
    expect(createSelector).toHaveBeenCalledTimes(1)
    expect(createSelector).toHaveBeenCalledWith('title', undefined)
    expect(api.getState).not.toHaveBeenCalled()
    expect(selectTitle).not.toHaveBeenCalled()
    expect(setTitle).not.toHaveBeenCalled()
    const request = {}
    const next = jest.fn(() => 'nextvalue')
    const result = await middleware(request, next)
    expect(api.getState).toHaveBeenCalledTimes(1)
    expect(api.getState).toHaveBeenCalledWith()
    expect(createSelector).toHaveBeenCalledTimes(1)
    expect(selectTitle).toHaveBeenCalledTimes(1)
    expect(selectTitle).toHaveBeenCalledWith('test state')
    expect(setTitle).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
    expect(result).toEqual('nextvalue')
  })

  test('Does not set the title if it is a function', async () => {
    const setTitle = jest.fn()
    const selectTitle = jest.fn(() => () => {})
    const createSelector = jest.fn(() => selectTitle)
    const creator = changePageTitle({
      isServer: () => false,
      setTitle,
      createSelector,
    })
    const api = {
      getState: jest.fn(() => 'test state'),
    }
    const middleware = creator(api)
    expect(createSelector).toHaveBeenCalledTimes(1)
    expect(createSelector).toHaveBeenCalledWith('title', undefined)
    expect(api.getState).not.toHaveBeenCalled()
    expect(selectTitle).not.toHaveBeenCalled()
    expect(setTitle).not.toHaveBeenCalled()
    const request = {}
    const next = jest.fn(() => 'nextvalue')
    const result = await middleware(request, next)
    expect(api.getState).toHaveBeenCalledTimes(1)
    expect(api.getState).toHaveBeenCalledWith()
    expect(createSelector).toHaveBeenCalledTimes(1)
    expect(selectTitle).toHaveBeenCalledTimes(1)
    expect(selectTitle).toHaveBeenCalledWith('test state')
    expect(setTitle).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
    expect(result).toEqual('nextvalue')
  })
})
