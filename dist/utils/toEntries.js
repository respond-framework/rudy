"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findInitialN = exports.default = void 0;

var _index = require("./index");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _default = function _default(api, entries, index, n) {
  entries = isSingleEntry(entries) ? [entries] : entries;
  entries = entries.length === 0 ? ['/'] : entries;
  entries = entries.map(function (e) {
    return (0, _index.toAction)(api, e);
  });
  index = index !== undefined ? index : entries.length - 1; // default to head of array

  index = Math.min(Math.max(index, 0), entries.length - 1); // insure the index is in range

  n = n || findInitialN(index, entries); // initial direction the user is going across the history track

  return {
    n: n,
    index: index,
    entries: entries
  };
}; // When entries are restored on load, the direction is always forward if on an index > 0
// because the corresponding entries are removed (just like a `push`), and you are now at the head.
// Otherwise, if there are multiple entries and you are on the first, you're considered
// to be going back, but if there is one, you're logically going forward.


exports.default = _default;

var findInitialN = function findInitialN(index, entries) {
  return index > 0 ? 1 : entries.length > 1 ? -1 : 1;
};

exports.findInitialN = findInitialN;

var isSingleEntry = function isSingleEntry(e) {
  return !Array.isArray(e) || // $FlowFixMe
  typeof e[0] === 'string' && _typeof(e[1]) === 'object' && !e[1].type;
}; // pattern match: [string, state]
//# sourceMappingURL=toEntries.js.map