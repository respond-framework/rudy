"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _types = require("../types");

var _default = function _default(action, _ref) {
  var routes = _ref.routes;
  var _action$type = action.type,
      type = _action$type === void 0 ? '' : _action$type;
  var route = routes[type];
  return route || type.indexOf(_types.PREFIX) > -1;
};

exports.default = _default;
//# sourceMappingURL=shouldTransition.js.map