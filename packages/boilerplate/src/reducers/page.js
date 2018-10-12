const components = {
  HOME: 'Home',
  LIST: 'List',
  NOT_FOUND: 'NotFound',
}

export default (state = 'HOME', action = {}) => {
  // for dynamic routes, as this reducer is for mapping.

  if (action.component) {
    return action.component
  }
  return components[action.type] || state
}

// NOTES: this is the primary reducer demonstrating how RFR replaces the need
// for React Router's <Route /> component.
//
// ALSO:  Forget a switch, use a hash table for perf.
