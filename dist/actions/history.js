"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setBasename = exports.setHash = exports.setState = exports.setQuery = exports.setParams = exports.set = exports.next = exports.back = exports.reset = exports.jump = exports.replace = exports.push = void 0;

var _types = require("../types");

var push = function push(path, state) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'push',
      args: [path, state]
    }
  };
};

exports.push = push;

var replace = function replace(path, state) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'replace',
      args: [path, state]
    }
  };
};

exports.replace = replace;

var jump = function jump(delta, state, byIndex, n) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'jump',
      args: [delta, state, byIndex, n]
    }
  };
};

exports.jump = jump;

var reset = function reset(entries, index, n) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'reset',
      args: [entries, index, n]
    }
  };
};

exports.reset = reset;

var back = function back(state) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'back',
      args: [state]
    }
  };
};

exports.back = back;

var next = function next(state) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'next',
      args: [state]
    }
  };
};

exports.next = next;

var set = function set(action, n, byIndex) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'set',
      args: [action, n, byIndex]
    }
  };
};

exports.set = set;

var setParams = function setParams(params, n, byIndex) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{
        params: params
      }, n, byIndex]
    }
  };
};

exports.setParams = setParams;

var setQuery = function setQuery(query, n, byIndex) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{
        query: query
      }, n, byIndex]
    }
  };
};

exports.setQuery = setQuery;

var setState = function setState(state, n, byIndex) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{
        state: state
      }, n, byIndex]
    }
  };
};

exports.setState = setState;

var setHash = function setHash(hash, n, byIndex) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{
        hash: hash
      }, n, byIndex]
    }
  };
};

exports.setHash = setHash;

var setBasename = function setBasename(basename, n, byIndex) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{
        basename: basename
      }, n, byIndex]
    }
  };
}; // NOTE: see `src/utils/formatRoutes.js` for implementation of corresponding pathlessRoute


exports.setBasename = setBasename;
//# sourceMappingURL=history.js.map