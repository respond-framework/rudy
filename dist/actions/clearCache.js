"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _types = require("../types");

var _default = function _default(invalidator, options) {
  return {
    type: _types.CLEAR_CACHE,
    payload: {
      invalidator: invalidator,
      options: options
    }
  };
}; // NOTE: see `src/utils/formatRoutes.js` for implementation of corresponding pathlessRoute


exports.default = _default;
//# sourceMappingURL=clearCache.js.map