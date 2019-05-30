function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { enhanceRoutes, shouldCall, createCache, autoDispatch } from './utils';
import { noOp } from '../../utils';
export default (function (name) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (api) {
    var _config$cache = config.cache,
        cache = _config$cache === void 0 ? false : _config$cache,
        _config$prev = config.prev,
        prev = _config$prev === void 0 ? false : _config$prev,
        _config$skipOpts = config.skipOpts,
        skipOpts = _config$skipOpts === void 0 ? false : _config$skipOpts,
        _config$start = config.start,
        start = _config$start === void 0 ? false : _config$start;
    enhanceRoutes(name, api.routes, api.options);
    api.options.callbacks = api.options.callbacks || [];
    api.options.callbacks.push(name);
    api.options.shouldCall = api.options.shouldCall || shouldCall;

    if (cache) {
      api.cache = createCache(api, name, config);
    }

    return function (req) {
      var next = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noOp;
      var route = prev ? req.prevRoute : req.route;
      var isCached = cache && api.cache.isCached(name, route, req);
      if (isCached) return next();
      var calls = req.options.shouldCall(name, route, req, config);
      if (!calls) return next();
      var r = calls.route && route[name] || noOp;
      var o = calls.options && !skipOpts && req.options[name] || noOp;

      if (start) {
        var action = _objectSpread({}, req.action, {
          type: "".concat(req.type, "_START")
        });

        req.commitDispatch(action);
        req._start = true;
      }

      return Promise.all([autoDispatch(req, r, route, name), autoDispatch(req, o, route, name, true)]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            r = _ref2[0],
            o = _ref2[1];

        req._start = false;

        if (isFalse(r, o)) {
          // set the current callback name and whether its on the previous route (beforeLeave) or current
          // so that `req.confirm()` can temporarily delete it and pass through the pipeline successfully
          // in a confirmation modal or similar
          req.last = {
            name: name,
            prev: prev
          };

          if (!req.tmp.committed) {
            req.block(); // update state.blocked === actionBlockedFrom
          }

          return false;
        }

        if (req.ctx.doubleDispatchRedirect) {
          // dispatches to current location during redirects blocked, see `transformAction/index.js`
          var _res = r !== undefined ? r : o;

          return req.handleDoubleDispatchRedirect(_res);
        } // `_dispatched` is a flag used to find whether actions were already dispatched in order
        // to determine whether to automatically dispatch it. The goal is not to dispatch twice.
        //
        // We delete these keys so they don't show up in responses returned from `store.dispatch`
        // NOTE: they are only applied to responses, which often are actions, but only AFTER they
        // are dispatched. This way reducers never see this key. See `core/createRequest.js`


        if (r) delete r._dispatched;
        if (o) delete o._dispatched;
        if (cache) req.cache.cacheAction(name, req.action);
        var res = r !== undefined ? r : o;
        return next().then(function () {
          return res;
        });
      });
    };
  };
});

var isFalse = function isFalse(r, o) {
  return r === false || o === false;
};
//# sourceMappingURL=index.js.map