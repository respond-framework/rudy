"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("@respond-framework/utils");

var _utils2 = require("../../../utils");

var defaultCreateCacheKey = function defaultCreateCacheKey(action, name) {
  var type = action.type,
      basename = action.basename,
      location = action.location;
  var pathname = location.pathname,
      search = location.search;
  return "".concat(name, "|").concat(type, "|").concat(basename, "|").concat(pathname, "|").concat(search); // don't cache using URL hash, as in 99.999% of all apps its the same route
};

var callbacks = [];

var _default = function _default(api, name, config) {
  if (config.prev) {
    throw new Error("[rudy] call('".concat(name, "') middleware 'cache' option cannot be used with 'prev' option"));
  }

  callbacks.push(name);
  if (api.cache) return api.cache;
  var _api$options$createCa = api.options.createCacheKey,
      createCacheKey = _api$options$createCa === void 0 ? defaultCreateCacheKey : _api$options$createCa;
  var cache = config.cacheStorage = config.cacheStorage || {};

  var isCached = function isCached(name, route, req) {
    if ((0, _utils.isServer)()) return false;
    var options = req.options,
        action = req.action;
    if (!route.path || route.cache === false) return false;
    if (options.cache === false && route.cache === undefined) return false;
    var key = createCacheKey(action, name);

    if (req.getKind() === 'load' && req.isUniversal()) {
      cache[key] = true;
    }

    if (cache[key]) return true;
    return false;
  };

  var cacheAction = function cacheAction(name, action) {
    var key = createCacheKey(action, name);
    cache[key] = true;
    return key;
  };

  var clear = function clear(invalidator) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!invalidator) {
      for (var k in cache) {
        delete cache[k];
      }
    } else if (typeof invalidator === 'function') {
      // allow user to customize cache clearing algo
      var newCache = invalidator(cache, api, opts); // invalidators should mutably operate on the cache hash

      if (newCache) {
        // but if they don't we'll merge into the same object reference
        for (var _k in cache) {
          delete cache[_k];
        }

        Object.assign(cache, newCache);
      }
    } else if (typeof invalidator === 'string') {
      // delete all cached items for TYPE or other string
      for (var _k2 in cache) {
        if (_k2.indexOf(invalidator) > -1) delete cache[_k2];
      }
    } else {
      // delete all/some callbacks for precise item (default)
      var action = invalidator;
      var act = (0, _utils2.toAction)(api, action);
      var names = opts.name === undefined ? callbacks : [].concat(opts.name);
      names.forEach(function (name) {
        var key = createCacheKey(act, name);
        delete cache[key];
      });
    }
  };

  return {
    isCached: isCached,
    cacheAction: cacheAction,
    clear: clear
  };
};

exports.default = _default;
//# sourceMappingURL=createCache.js.map