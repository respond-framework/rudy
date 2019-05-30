"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(action) {
  var type = typeof action === 'string' ? action : action.type || '';
  return type.indexOf('NOT_FOUND') > -1 && type.indexOf('NOT_FOUND_') === -1; // don't include types like `NOT_FOUND_COMPLETE`
};

exports.default = _default;
//# sourceMappingURL=isNotFound.js.map