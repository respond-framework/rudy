"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(req, callback, route, name, isOptCb) {
  return Promise.resolve(callback(req)).then(function (res) {
    return tryDispatch(req, res, route, name, isOptCb);
  });
};

exports.default = _default;

var tryDispatch = function tryDispatch(req, res, route, name, isOptCb) {
  if (res === false) return false;
  var hasReturn = res === null || res && !res._dispatched; // `res._dispatched` indicates it was manually dispatched

  if (hasReturn && isAutoDispatch(route, req.options, isOptCb)) {
    // if no dispatch was detected, and a result was returned, dispatch it automatically
    return Promise.resolve(req.dispatch(res));
  }

  return res;
};

var isAutoDispatch = function isAutoDispatch(route, options, isOptCb) {
  return isOptCb ? options.autoDispatch === undefined ? true : options.autoDispatch : route.autoDispatch !== undefined ? route.autoDispatch : options.autoDispatch === undefined ? true : options.autoDispatch;
};
//# sourceMappingURL=autoDispatch.js.map