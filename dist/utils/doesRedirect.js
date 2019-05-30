"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("./index");

var _default = function _default(action, redirectFunc) {
  if ((0, _index.isRedirect)(action)) {
    var url = action.location.url;
    var status = action.location.status || 302;

    if (typeof redirectFunc === 'function') {
      redirectFunc(status, url, action);
    } else if (redirectFunc && typeof redirectFunc.redirect === 'function') {
      redirectFunc.redirect(status, url);
    }

    return true;
  }

  return false;
};

exports.default = _default;
//# sourceMappingURL=doesRedirect.js.map