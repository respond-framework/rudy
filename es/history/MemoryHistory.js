function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import History from './History';
import { restoreHistory, saveHistory, supportsSession } from './utils';
import { toEntries } from '../utils'; // Even though this is used primarily in environments without `window` (server + React Native),
// it's also used as a fallback in browsers lacking the `history` API (<=IE9). In that now rare case,
// the URL won't change once you enter the site, however, if you forward or back out of the site
// we restore entries from `sessionStorage`. So essentially the application behavior is identical
// to browsers with `history` except the URL doesn't change.
// `initialEntries` can be:
// [path, path, etc] or: path
// [action, action, etc] or: action
// [[path, state, key?], [path, state, key?], etc] or: [path, state, key?]
// or any combination of different kinds

var MemoryHistory =
/*#__PURE__*/
function (_History) {
  _inherits(MemoryHistory, _History);

  function MemoryHistory() {
    _classCallCheck(this, MemoryHistory);

    return _possibleConstructorReturn(this, _getPrototypeOf(MemoryHistory).apply(this, arguments));
  }

  _createClass(MemoryHistory, [{
    key: "_restore",
    value: function _restore() {
      var opts = this.options;
      var i = opts.initialIndex,
          ents = opts.initialEntries,
          n = opts.initialN;
      var useSession = supportsSession() && opts.testBrowser !== false;
      opts.restore = opts.restore || useSession && restoreHistory;
      opts.save = opts.save || useSession && saveHistory;
      return opts.restore ? opts.restore(this) : toEntries(this, ents, i, n); // when used as a browser fallback, we restore from sessionStorage
    }
  }]);

  return MemoryHistory;
}(History);

export { MemoryHistory as default };
//# sourceMappingURL=MemoryHistory.js.map