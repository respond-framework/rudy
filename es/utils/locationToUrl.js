export default (function (location) {
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
});
//# sourceMappingURL=locationToUrl.js.map