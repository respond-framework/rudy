"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(type) {
  var i = type.lastIndexOf('/');
  return type.substr(0, i);
};

exports.default = _default;
//# sourceMappingURL=typeToScene.js.map