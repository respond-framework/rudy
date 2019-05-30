"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _qs = _interopRequireDefault(require("qs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(search) {
  return _qs.default.parse(search, {
    decoder: decoder
  });
};

exports.default = _default;

var decoder = function decoder(str, decode) {
  return isNumber(str) ? Number.parseFloat(str) : decode(str);
};

var isNumber = function isNumber(str) {
  return !Number.isNaN(Number.parseFloat(str));
};
//# sourceMappingURL=parseSearch.js.map