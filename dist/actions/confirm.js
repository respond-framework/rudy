"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _types = require("../types");

var _default = function _default() {
  var canLeave = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  return {
    type: _types.CONFIRM,
    payload: {
      canLeave: canLeave
    }
  };
}; // NOTE: see `src/utils/formatRoutes.js` for implementation of corresponding pathlessRoute


exports.default = _default;
//# sourceMappingURL=confirm.js.map