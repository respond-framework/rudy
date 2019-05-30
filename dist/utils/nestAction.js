"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createActionRef = exports.default = void 0;

var _index = require("./index");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var _default = function _default(action, prevState, fromAction, statusCode) {
  var tmp = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var location = action.location,
      type = action.type,
      basename = action.basename,
      params = action.params,
      query = action.query,
      state = action.state,
      hash = action.hash;
  var entries = location.entries,
      index = location.index,
      length = location.length,
      pathname = location.pathname,
      search = location.search,
      url = location.url,
      key = location.key,
      scene = location.scene,
      n = location.n;
  var prev = createActionRef(prevState);
  var from = createActionRef(fromAction);
  var kind = resolveKind(location.kind, tmp.load, from);
  var direction = n === -1 ? 'backward' : 'forward';
  var pop = !!tmp.revertPop;
  var status = from ? statusCode || 302 : (0, _index.isNotFound)(type) ? 404 : 200;
  return {
    type: type,
    params: params,
    query: query,
    state: state,
    hash: hash,
    basename: basename,
    location: {
      kind: kind,
      direction: direction,
      n: n,
      url: url,
      pathname: pathname,
      search: search,
      key: key,
      scene: scene,
      prev: prev,
      from: from,
      blocked: null,
      entries: entries,
      index: index,
      length: length,
      pop: pop,
      status: status
    }
  };
};

exports.default = _default;

var createActionRef = function createActionRef(actionOrState) {
  if (!actionOrState) return null; // if `prev` or redirect action from outside of pipeline, we receive the state instead (see ./formatAction.js)

  if (!actionOrState.location) {
    var type = actionOrState.type,
        params = actionOrState.params,
        query = actionOrState.query,
        state = actionOrState.state,
        hash = actionOrState.hash,
        basename = actionOrState.basename,
        rest = _objectWithoutProperties(actionOrState, ["type", "params", "query", "state", "hash", "basename"]);

    var location = createLocationRef(rest);
    var action = {
      type: type,
      params: params,
      query: query,
      state: state,
      hash: hash,
      basename: basename,
      location: location
    };
    return action;
  } // if redirect occurred during pipeline, we receive an action representing the previous state


  return _objectSpread({}, actionOrState, {
    location: createLocationRef(_objectSpread({}, actionOrState.location))
  });
};

exports.createActionRef = createActionRef;

var createLocationRef = function createLocationRef(loc) {
  delete loc.prev;
  delete loc.from;
  delete loc.blocked;
  delete loc.universal;
  delete loc.length;
  delete loc.kind;
  delete loc.entries;
  delete loc.pop;
  delete loc.status;
  delete loc.direction;
  delete loc.n;
  delete loc.universal;
  delete loc.ready;
  return loc;
};

var resolveKind = function resolveKind(kind, isLoad, from) {
  if (isLoad) return 'load'; // insure redirects don't change kind on load

  if (!from) return kind; // PRIMARY USE CASE: preverse the standard kind
  // pipeline redirects before enter are in fact pushes, but users shouldn't
  // have to think about that -- using `kind.replace` preserves back/next kinds

  return kind.replace('push', 'replace');
};
//# sourceMappingURL=nestAction.js.map