import createTest from '../../__helpers__/createTest'

createTest(
  'state attached to history entry',
  {
    SECOND: {
      path: '/second',
    },
  },
  [{ type: 'SECOND', state: { foo: 'bar' } }],
)

createTest(
  'route.defaultState',
  {
    SECOND: {
      path: '/second',
      defaultState: { foo: 'bar' },
    },
    THIRD: {
      path: '/third',
      defaultState: (q) => ({ ...q, foo: 'bar' }),
    },
  },
  [{ type: 'SECOND', state: { key: 'correct' } }, { type: 'SECOND' }],
  async ({ history, snapChange }) => {
    const res = await history.push('/third', { abc: 123 })
    snapChange(res)
  },
)
