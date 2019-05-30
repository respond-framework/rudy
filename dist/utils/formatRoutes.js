"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatRoute = exports.default = void 0;

var _types = require("../types");

var _pathlessRoutes = require("../pathlessRoutes");

var _default = function _default(input, formatter) {
  var isAddRoutes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var routes = isAddRoutes ? input : {};

  if (!isAddRoutes) {
    routes.NOT_FOUND = input.NOT_FOUND || {
      path: '/not-found'
    };
    Object.assign(routes, input); // insure '/not-found' matches over '/:param?' -- yes, browsers respect order assigned for non-numeric keys

    routes[_types.ADD_ROUTES] = input[_types.ADD_ROUTES] || {
      thunk: _pathlessRoutes.addRoutes,
      dispatch: false
    };
    routes[_types.CHANGE_BASENAME] = input[_types.CHANGE_BASENAME] || {
      thunk: _pathlessRoutes.changeBasename,
      dispatch: false
    };
    routes[_types.CLEAR_CACHE] = input[_types.CLEAR_CACHE] || {
      thunk: _pathlessRoutes.clearCache
    };
    routes[_types.CONFIRM] = input[_types.CONFIRM] || {
      thunk: _pathlessRoutes.confirm,
      dispatch: false
    };
    routes[_types.CALL_HISTORY] = input[_types.CALL_HISTORY] || {
      thunk: _pathlessRoutes.callHistory,
      dispatch: false
    };
  }

  var types = Object.keys(routes);
  types.forEach(function (type) {
    var route = formatRoute(routes[type], type, routes, formatter, isAddRoutes);
    route.type = type;
    routes[type] = route;
  });
  return routes;
};

exports.default = _default;

var formatRoute = function formatRoute(r, type, routes, formatter) {
  var isAddRoutes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var route = typeof r === 'string' ? {
    path: r
  } : r;

  if (formatter) {
    return formatter(route, type, routes, isAddRoutes);
  }

  if (typeof route === 'function') {
    return {
      thunk: route
    };
  }

  return route;
};

exports.formatRoute = formatRoute;
//# sourceMappingURL=formatRoutes.js.map