"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(action) {
  return !!(action && action.location && (action.location.kind === 'replace' || action.location.from));
}; // sometimes the kind will be back/next when automatic back/next detection is in play


exports.default = _default;
//# sourceMappingURL=isRedirect.js.map