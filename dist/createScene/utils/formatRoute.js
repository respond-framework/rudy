"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../../utils");

var _default = function _default(r, type, routes, formatter) {
  var route = (0, _utils.formatRoute)(r, type, routes, formatter);
  route.scene = (0, _utils.typeToScene)(type); // set default path for NOT_FOUND actions if necessary

  if (!route.path && (0, _utils.isNotFound)(type)) {
    route.path = route.scene ? // $FlowFixMe
    "/".concat(r.scene.toLowerCase(), "/not-found") : '/not-found';
  }

  return route;
};

exports.default = _default;
//# sourceMappingURL=formatRoute.js.map