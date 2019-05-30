"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(a) {
  return a && (a.type || // History uses actions with undefined states
  a.hasOwnProperty('state') || // eslint-disable-line no-prototype-builtins
  a.params || a.query || a.hash !== undefined || a.basename !== undefined || a.payload || a.meta);
};

exports.default = _default;
//# sourceMappingURL=isAction.js.map