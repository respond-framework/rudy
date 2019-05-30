"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("@respond-framework/utils");

var _default = function _default(req) {
  var _req$getLocation = req.getLocation(),
      universal = _req$getLocation.universal;

  return universal && !(0, _utils.isServer)() && req.getKind() === 'load';
};

exports.default = _default;
//# sourceMappingURL=isHydrate.js.map