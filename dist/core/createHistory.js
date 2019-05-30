"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _BrowserHistory = _interopRequireDefault(require("../history/BrowserHistory"));

var _MemoryHistory = _interopRequireDefault(require("../history/MemoryHistory"));

var _utils = require("../history/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(routes) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return (0, _utils.supportsDom)() && (0, _utils.supportsHistory)() && opts.testBrowser !== false ? new _BrowserHistory.default(routes, opts) : new _MemoryHistory.default(routes, opts);
};

exports.default = _default;
//# sourceMappingURL=createHistory.js.map