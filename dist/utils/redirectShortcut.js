"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _actions = require("../actions");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = function _default(_ref) {
  var route = _ref.route,
      routes = _ref.routes,
      action = _ref.action,
      dispatch = _ref.dispatch;
  var t = route.redirect; // $FlowFixMe

  var scenicType = "".concat(route.scene, "/").concat(t);
  var type = routes[scenicType] ? scenicType : t; // $FlowFixMe

  return dispatch((0, _actions.redirect)(_objectSpread({}, action, {
    type: type
  }), 301));
};

exports.default = _default;
//# sourceMappingURL=redirectShortcut.js.map