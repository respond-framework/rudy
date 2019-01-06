export default (state = '', action = {}) =>
  action.type === 'CATEGORIES' ? action.params.category : state
