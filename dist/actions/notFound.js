"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(state, type) {
  return {
    type: type || 'NOT_FOUND',
    // type not meant for user to supply; it's passed by generated action creators
    state: state
  };
};

exports.default = _default;
//# sourceMappingURL=notFound.js.map