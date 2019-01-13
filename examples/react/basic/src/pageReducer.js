const components = {
  HOME: 'Home',
  USER: 'User',
  NOT_FOUND: 'NotFound',
}

export default (state = 'Home', action = {}) => components[action.type] || state
