"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(location) {
  if (typeof location === 'string') return location;
  var pathname = location.pathname,
      search = location.search,
      hash = location.hash;
  var path = pathname || '/';

  if (search && search !== '?') {
    path += search.charAt(0) === '?' ? search : "?".concat(search);
  }

  if (hash && hash !== '#') {
    path += hash.charAt(0) === '#' ? hash : "#".concat(hash);
  }

  return path;
};

exports.default = _default;
//# sourceMappingURL=locationToUrl.js.map