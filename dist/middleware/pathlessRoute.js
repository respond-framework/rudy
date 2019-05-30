"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("./index");

var _default = function _default() {
  for (var _len = arguments.length, names = new Array(_len), _key = 0; _key < _len; _key++) {
    names[_key] = arguments[_key];
  }

  return function (api) {
    names[0] = names[0] || 'thunk';
    names[1] = names[1] || 'onComplete';
    var middlewares = names.map(function (name) {
      return (0, _index.call)(name, {
        runOnServer: true,
        skipOpts: true
      });
    });
    var pipeline = api.options.compose(middlewares, api); // Registering is currently only used when core features (like the
    // `addRoutes` action creator) depend on the middleware being available.
    // See `utils/formatRoutes.js` for how `has` is used to throw
    // errors when not available.

    api.register('pathlessRoute');
    return function (req, next) {
      var route = req.route;
      var isPathless = route && !route.path;

      if (isPathless && hasCallback(route, names)) {
        if (route.dispatch !== false) {
          req.action = req.commitDispatch(req.action);
        }

        return pipeline(req).then(function (res) {
          return res || req.action;
        });
      }

      return next();
    };
  };
};

exports.default = _default;

var hasCallback = function hasCallback(route, names) {
  return names.find(function (name) {
    return typeof route[name] === 'function';
  });
};
//# sourceMappingURL=pathlessRoute.js.map