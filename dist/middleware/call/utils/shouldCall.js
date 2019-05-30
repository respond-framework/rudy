"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("@respond-framework/utils");

var _utils2 = require("../../../utils");

var _default = function _default(name, route, req, _ref) {
  var runOnServer = _ref.runOnServer,
      runOnHydrate = _ref.runOnHydrate;
  if (!route[name] && !req.options[name]) return false;
  if ((0, _utils2.isHydrate)(req) && !runOnHydrate) return false;
  if ((0, _utils.isServer)() && !runOnServer) return false;
  return allowBoth;
};

exports.default = _default;
var allowBoth = {
  route: true,
  options: true // If for instance, you wanted to allow each route to decide
  // whether to skip options callbacks, here's a simple way to do it:
  //
  // return {
  //   options: !route.skipOpts, // if true, don't make those calls
  //   route: true
  // }
  //
  // You also could choose to automatically trigger option callbacks only as a fallback:
  //
  // return {
  //   options: !route[name],
  //   route: !!route[name]
  // }

};
//# sourceMappingURL=shouldCall.js.map