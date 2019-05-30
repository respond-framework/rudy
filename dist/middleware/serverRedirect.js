"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("@respond-framework/utils");

var _utils2 = require("../utils");

var _default = function _default(api) {
  return function (req, next) {
    if ((0, _utils.isServer)() && (0, _utils2.isRedirect)(req.action)) {
      var action = req.action;

      var _actionToUrl = (0, _utils2.actionToUrl)(action, api),
          url = _actionToUrl.url;

      action.url = action.location.url = url;
      action.status = action.location.status || 302; // account for anonymous thunks potentially redirecting without returning itself
      // and not able to be discovered by regular means in `utils/createRequest.js`

      req.ctx.serverRedirect = true;
      return action;
    }

    return next();
  };
};

exports.default = _default;
//# sourceMappingURL=serverRedirect.js.map