function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

import { camelCase, logExports, makeActionCreator, formatRoute } from './utils';
export default (function (routesMap) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var sc = opts.scene,
      bn = opts.basename,
      formatter = opts.formatRoute,
      _opts$subtypes = opts.subtypes,
      st = _opts$subtypes === void 0 ? [] : _opts$subtypes,
      log = opts.logExports;
  var scene = sc || '';
  var prefix = scene ? "".concat(scene, "/") : '';
  var keys = Object.keys(routesMap);
  var subtypes = [].concat(_toConsumableArray(st), ['start', 'complete', 'error', 'done']);
  var result = keys.reduce(function (result, t) {
    var types = result.types,
        actions = result.actions,
        routes = result.routes;
    var t2 = "".concat(prefix).concat(t);
    var tc = "".concat(prefix).concat(t, "_COMPLETE");
    var te = "".concat(prefix).concat(t, "_ERROR");
    routes[t2] = formatRoute(routesMap[t], t2, routesMap, formatter);
    var route = routes[t2];
    var tClean = route.scene ? t2.replace("".concat(route.scene, "/"), '') : t; // strip the scene so types will be un-prefixed (NOTE: this is normalization for if routes pass through `createScene` twice)

    var action = camelCase(tClean);
    types[tClean] = t2;
    types["".concat(tClean, "_COMPLETE")] = tc;
    types["".concat(tClean, "_ERROR")] = te; // allow for creating custom action creators (whose names are an array assigned to route.action)

    if (Array.isArray(route.action)) {
      var key = route.action[0];
      actions[action] = makeActionCreator(route, t2, key, bn); // the first action in the array becomes the primary action creator
      // all are tacked on like action.complete, action.error

      route.action.forEach(function (key) {
        actions[action][key] = makeActionCreator(route, t2, key, bn);
      });
    } else {
      actions[action] = makeActionCreator(route, t2, 'action', bn);
    }

    subtypes.forEach(function (name) {
      var suffix = "_".concat(name.toUpperCase());
      var cleanType = "".concat(tClean).concat(suffix);
      var realType = "".concat(prefix).concat(t).concat(suffix);
      types[cleanType] = realType;
      actions[action][name] = makeActionCreator(route, realType, name, bn, subtypes);
    });
    return result;
  }, {
    types: {},
    actions: {},
    routes: {}
  });
  var types = result.types,
      actions = result.actions; // $FlowFixMe

  if (log && /^(development|test)$/.test(process.env.NODE_ENV)) {
    result.exportString = logExports(types, actions, result.routes, opts);
  }

  return result;
});
//# sourceMappingURL=index.js.map