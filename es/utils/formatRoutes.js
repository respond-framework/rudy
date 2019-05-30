import { ADD_ROUTES, CHANGE_BASENAME, CLEAR_CACHE, CONFIRM, CALL_HISTORY } from '../types';
import { addRoutes, changeBasename, clearCache, confirm, callHistory } from '../pathlessRoutes';
export default (function (input, formatter) {
  var isAddRoutes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var routes = isAddRoutes ? input : {};

  if (!isAddRoutes) {
    routes.NOT_FOUND = input.NOT_FOUND || {
      path: '/not-found'
    };
    Object.assign(routes, input); // insure '/not-found' matches over '/:param?' -- yes, browsers respect order assigned for non-numeric keys

    routes[ADD_ROUTES] = input[ADD_ROUTES] || {
      thunk: addRoutes,
      dispatch: false
    };
    routes[CHANGE_BASENAME] = input[CHANGE_BASENAME] || {
      thunk: changeBasename,
      dispatch: false
    };
    routes[CLEAR_CACHE] = input[CLEAR_CACHE] || {
      thunk: clearCache
    };
    routes[CONFIRM] = input[CONFIRM] || {
      thunk: confirm,
      dispatch: false
    };
    routes[CALL_HISTORY] = input[CALL_HISTORY] || {
      thunk: callHistory,
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
});
export var formatRoute = function formatRoute(r, type, routes, formatter) {
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
//# sourceMappingURL=formatRoutes.js.map