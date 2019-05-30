import { CALL_HISTORY } from '../types';
export var push = function push(path, state) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'push',
      args: [path, state]
    }
  };
};
export var replace = function replace(path, state) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'replace',
      args: [path, state]
    }
  };
};
export var jump = function jump(delta, state, byIndex, n) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'jump',
      args: [delta, state, byIndex, n]
    }
  };
};
export var reset = function reset(entries, index, n) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'reset',
      args: [entries, index, n]
    }
  };
};
export var back = function back(state) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'back',
      args: [state]
    }
  };
};
export var next = function next(state) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'next',
      args: [state]
    }
  };
};
export var set = function set(action, n, byIndex) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'set',
      args: [action, n, byIndex]
    }
  };
};
export var setParams = function setParams(params, n, byIndex) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{
        params: params
      }, n, byIndex]
    }
  };
};
export var setQuery = function setQuery(query, n, byIndex) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{
        query: query
      }, n, byIndex]
    }
  };
};
export var setState = function setState(state, n, byIndex) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{
        state: state
      }, n, byIndex]
    }
  };
};
export var setHash = function setHash(hash, n, byIndex) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{
        hash: hash
      }, n, byIndex]
    }
  };
};
export var setBasename = function setBasename(basename, n, byIndex) {
  return {
    type: CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{
        basename: basename
      }, n, byIndex]
    }
  };
}; // NOTE: see `src/utils/formatRoutes.js` for implementation of corresponding pathlessRoute
//# sourceMappingURL=history.js.map