function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

export default (function (routes) {
  return function (action, key) {
    var type = typeof action === 'string' ? action : action.type;
    var route = routes[type];
    if (!route) return null;
    if (!key) return route;
    if (typeof route[key] !== 'function') return route[key];
    action = _typeof(action) === 'object' ? action : {
      type: type
    };

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return route[key].apply(route, [action].concat(args));
  };
}); // usage:
// callRoute(routes)(action, key, ...args)
//# sourceMappingURL=callRoute.js.map