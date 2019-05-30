"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPrevEmpty = exports.createPrev = exports.createInitialState = exports.default = void 0;

var _types = require("../types");

var _utils = require("../utils");

var _utils2 = require("@respond-framework/utils");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var _default = function _default(initialState, routes) {
  return function () {
    var st = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var r = routes[action.type];
    var l = action.location;

    if (l && l.kind === 'set') {
      var commit = action.commit,
          _action$location = action.location,
          kind = _action$location.kind,
          location = _objectWithoutProperties(_action$location, ["kind"]),
          act = _objectWithoutProperties(action, ["commit", "location"]);

      return _objectSpread({}, st, act, location);
    }

    if (r && r.path && (l.url !== st.url || /load|reset/.test(l.kind))) {
      var type = action.type,
          params = action.params,
          query = action.query,
          state = action.state,
          hash = action.hash,
          basename = action.basename;
      var universal = st.universal;

      var s = _objectSpread({
        type: type,
        params: params,
        query: query,
        state: state,
        hash: hash,
        basename: basename,
        universal: universal
      }, l);

      if (st.ready === false) s.ready = true;
      return s;
    }

    if (action.type === _types.ADD_ROUTES) {
      var routesAdded = action.payload.routesAdded;
      return _objectSpread({}, st, {
        routesAdded: routesAdded
      });
    }

    if (action.type === _types.SET_FROM) {
      var ref = action.payload.ref;
      return _objectSpread({}, st, {
        from: ref
      });
    }

    if (action.type === _types.BLOCK) {
      var _ref = action.payload.ref;
      return _objectSpread({}, st, {
        blocked: _ref
      });
    }

    if (action.type === _types.UNBLOCK) {
      return _objectSpread({}, st, {
        blocked: null
      });
    }

    if (action.type.indexOf('_ERROR') > -1) {
      var error = action.error,
          errorType = action.type;
      return _objectSpread({}, st, {
        error: error,
        errorType: errorType
      });
    }

    if (action.type.indexOf('_COMPLETE') > -1) {
      return _objectSpread({}, st, {
        ready: true
      });
    }

    if (action.type.indexOf('_START') > -1) {
      return _objectSpread({}, st, {
        ready: false
      });
    }

    return st;
  };
};

exports.default = _default;

var createInitialState = function createInitialState(action) {
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
  var direction = n === -1 ? 'backward' : 'forward';
  var prev = createPrev(location);
  var universal = (0, _utils2.isServer)();
  var status = (0, _utils.isNotFound)(type) ? 404 : 200;
  return {
    kind: 'init',
    direction: direction,
    n: n,
    type: type,
    params: params,
    query: query,
    state: state,
    hash: hash,
    basename: basename,
    url: url,
    pathname: pathname,
    search: search,
    key: key,
    scene: scene,
    prev: prev,
    from: null,
    blocked: null,
    entries: entries,
    index: index,
    length: length,
    universal: universal,
    pop: false,
    status: status
  };
};

exports.createInitialState = createInitialState;

var createPrev = function createPrev(location) {
  var n = location.n,
      i = location.index,
      entries = location.entries; // needs to use real lastIndex instead of -1

  var index = i + n * -1; // the entry action we want is the opposite of the direction the user is going

  var prevAction = entries[index];
  if (!prevAction) return createPrevEmpty();
  return _objectSpread({}, prevAction, {
    location: _objectSpread({}, prevAction.location, {
      index: index
    })
  });
};

exports.createPrev = createPrev;

var createPrevEmpty = function createPrevEmpty() {
  return {
    type: '',
    params: {},
    query: {},
    state: {},
    hash: '',
    basename: '',
    location: {
      url: '',
      pathname: '',
      search: '',
      key: '',
      scene: '',
      index: -1
    }
  };
};

exports.createPrevEmpty = createPrevEmpty;
//# sourceMappingURL=createReducer.js.map