"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _types = require("../types");

var _default = function _default(routes, formatRoute) {
  return {
    type: _types.ADD_ROUTES,
    payload: {
      routes: routes,
      formatRoute: formatRoute
    }
  };
}; // NOTE: see `src/utils/formatRoutes.js` for implementation of corresponding pathlessRoute


exports.default = _default;
//# sourceMappingURL=addRoutes.js.map