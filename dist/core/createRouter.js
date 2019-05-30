"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _qs = _interopRequireDefault(require("qs"));

var _utils = require("@respond-framework/utils");

var _index = require("./index");

var _utils2 = require("../utils");

var _middleware = require("../middleware");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default() {
  var routesInput = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var middlewares = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [_middleware.serverRedirect, // short-circuiting middleware
  _middleware.anonymousThunk, (0, _middleware.pathlessRoute)('thunk'), _middleware.transformAction, // pipeline starts here
  // Hydrate: skip callbacks called on server to produce initialState (beforeEnter, thunk, etc)
  // Server: don't allow client-centric callbacks (onEnter, onLeave, beforeLeave)
  (0, _middleware.call)('beforeLeave', {
    prev: true
  }), (0, _middleware.call)('beforeEnter', {
    runOnServer: true
  }), _middleware.enter, (0, _middleware.changePageTitle)({
    title: options.title
  }), (0, _middleware.call)('onLeave', {
    prev: true
  }), (0, _middleware.call)('onEnter', {
    runOnHydrate: true
  }), (0, _middleware.call)('thunk', {
    cache: true,
    runOnServer: true
  }), (0, _middleware.call)('onComplete', {
    runOnServer: true
  })];
  var location = options.location,
      title = options.title,
      formatRoute = options.formatRoute,
      _options$createHistor = options.createHistory,
      createSmartHistory = _options$createHistor === void 0 ? _index.createHistory : _options$createHistor,
      _options$createReduce = options.createReducer,
      createLocationReducer = _options$createReduce === void 0 ? _index.createReducer : _options$createReduce,
      _options$createInitia = options.createInitialState,
      createState = _options$createInitia === void 0 ? _index.createInitialState : _options$createInitia,
      onErr = options.onError; // assign to options so middleware can override them in 1st pass if necessary

  options.shouldTransition = options.shouldTransition || _utils2.shouldTransition;
  options.createRequest = options.createRequest || _index.createRequest;
  options.compose = options.compose || _index.compose;
  options.onError = typeof onErr !== 'undefined' ? onErr : _utils2.onError;
  options.parseSearch = options.parseSearch || _utils2.parseSearch;
  options.stringifyQuery = options.stringifyQuery || _qs.default.stringify;
  var routes = (0, _utils2.formatRoutes)(routesInput, formatRoute);
  var selectLocationState = (0, _utils.createSelector)('location', location);
  var history = createSmartHistory(routes, options);
  var firstAction = history.firstAction;
  var initialState = createState(firstAction);
  var reducer = createLocationReducer(initialState, routes);
  var wares = {};

  var register = function register(name) {
    var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    return wares[name] = val;
  };

  var has = function has(name) {
    return wares[name];
  };

  var ctx = {
    busy: false
  };
  var api = {
    routes: routes,
    history: history,
    options: options,
    register: register,
    has: has,
    ctx: ctx
  };
  var onError = (0, _middleware.call)('onError', {
    runOnServer: true,
    runOnHydrate: true
  })(api);
  var nextPromise = options.compose(middlewares, api, true);

  var middleware = function middleware(_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;

    var getLocation = function getLocation(s) {
      return selectLocationState(s || getState() || {});
    };

    var shouldTransition = options.shouldTransition,
        createRequest = options.createRequest; // middlewares may mutably monkey-patch these in above call to `compose`
    // TODO: Fix these annotations

    Object.assign(api, {
      getLocation: getLocation,
      dispatch: dispatch,
      getState: getState
    });
    history.listen(dispatch, getLocation); // dispatch actions in response to pops, use redux location state as single source of truth

    return function (dispatch) {
      return function (action) {
        if (!shouldTransition(action, api)) return dispatch(action); // short-circuit and pass through Redux middleware normally

        if (action.tmp && action.tmp.canceled) return Promise.resolve(action);
        var req = createRequest(action, api, dispatch); // the `Request` arg passed to all middleware

        var mw = req.route.middleware;
        var next = mw ? options.compose(mw, api, !!req.route.path) : nextPromise;
        return next(req) // start middleware pipeline
        .catch(function (error) {
          if (options.wallabyErrors) throw error; // wallaby UI is linkable if we don't re-throw errors (we'll see errors for the few tests of errors outside of wallaby)

          req.error = error;
          req.errorType = "".concat(req.action.type, "_ERROR");
          return onError(req);
        }).then(function (res) {
          var route = req.route,
              tmp = req.tmp,
              ctx = req.ctx,
              clientLoadBusy = req.clientLoadBusy;
          var isRoutePipeline = route.path && !tmp.canceled && !clientLoadBusy;
          ctx.busy = isRoutePipeline ? false : ctx.busy;
          return res;
        });
      };
    };
  };

  return {
    api: api,
    middleware: middleware,
    reducer: reducer,
    firstRoute: function firstRoute() {
      var resolveOnEnter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      api.resolveFirstRouteOnEnter = resolveOnEnter;
      return firstAction;
    }
  };
};

exports.default = _default;
//# sourceMappingURL=createRouter.js.map