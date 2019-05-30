export default (function (name, routes, options) {
  for (var type in routes) {
    var route = routes[type];
    var cb = route[name];
    var callback = findCallback(name, routes, cb, route, options);
    if (callback) route[name] = callback;
  }

  return routes;
});

var findCallback = function findCallback(name, routes, callback, route, options) {
  if (typeof callback === 'function') {
    return callback;
  }

  if (Array.isArray(callback)) {
    var callbacks = callback;
    var pipeline = callbacks.map(function (cb) {
      return function (req, next) {
        cb = findCallback(name, routes, cb, route);
        var prom = Promise.resolve(cb(req));
        return prom.then(complete(next));
      };
    });
    var killOnRedirect = !!route.path;
    return options.compose(pipeline, null, killOnRedirect);
  }

  if (typeof callback === 'string') {
    var type = callback;
    var inheritedRoute = routes["".concat(route.scene, "/").concat(type)] || routes[type];
    var cb = inheritedRoute[name];
    return findCallback(name, routes, cb, inheritedRoute);
  }

  if (typeof route.inherit === 'string') {
    var _type = route.inherit;

    var _inheritedRoute = routes["".concat(route.scene, "/").concat(_type)] || routes[_type];

    var _cb = _inheritedRoute[name];
    return findCallback(name, routes, _cb, _inheritedRoute);
  }
};

var complete = function complete(next) {
  return function (res) {
    return next().then(function () {
      return res;
    });
  };
};
//# sourceMappingURL=enhanceRoutes.js.map