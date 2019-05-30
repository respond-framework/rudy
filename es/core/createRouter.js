import qs from 'qs';
import { createSelector } from '@respond-framework/utils';
import { compose, createHistory, createReducer, createInitialState, createRequest } from './index';
import { formatRoutes, shouldTransition, parseSearch, onError as defaultOnError } from '../utils';
import { serverRedirect, pathlessRoute, anonymousThunk, transformAction, call, enter, changePageTitle } from '../middleware';
export default (function () {
  var routesInput = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var middlewares = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [serverRedirect, // short-circuiting middleware
  anonymousThunk, pathlessRoute('thunk'), transformAction, // pipeline starts here
  // Hydrate: skip callbacks called on server to produce initialState (beforeEnter, thunk, etc)
  // Server: don't allow client-centric callbacks (onEnter, onLeave, beforeLeave)
  call('beforeLeave', {
    prev: true
  }), call('beforeEnter', {
    runOnServer: true
  }), enter, changePageTitle({
    title: options.title
  }), call('onLeave', {
    prev: true
  }), call('onEnter', {
    runOnHydrate: true
  }), call('thunk', {
    cache: true,
    runOnServer: true
  }), call('onComplete', {
    runOnServer: true
  })];
  var location = options.location,
      title = options.title,
      formatRoute = options.formatRoute,
      _options$createHistor = options.createHistory,
      createSmartHistory = _options$createHistor === void 0 ? createHistory : _options$createHistor,
      _options$createReduce = options.createReducer,
      createLocationReducer = _options$createReduce === void 0 ? createReducer : _options$createReduce,
      _options$createInitia = options.createInitialState,
      createState = _options$createInitia === void 0 ? createInitialState : _options$createInitia,
      onErr = options.onError; // assign to options so middleware can override them in 1st pass if necessary

  options.shouldTransition = options.shouldTransition || shouldTransition;
  options.createRequest = options.createRequest || createRequest;
  options.compose = options.compose || compose;
  options.onError = typeof onErr !== 'undefined' ? onErr : defaultOnError;
  options.parseSearch = options.parseSearch || parseSearch;
  options.stringifyQuery = options.stringifyQuery || qs.stringify;
  var routes = formatRoutes(routesInput, formatRoute);
  var selectLocationState = createSelector('location', location);
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
  var onError = call('onError', {
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
});
//# sourceMappingURL=createRouter.js.map