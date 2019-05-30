import { compile } from 'path-to-regexp';
import { matchQuery, matchHash } from './matchUrl';
var toPathCache = {};
export default (function (path) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var query = arguments.length > 2 ? arguments[2] : undefined;
  var hash = arguments.length > 3 ? arguments[3] : undefined;
  var route = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var opts = arguments.length > 5 ? arguments[5] : undefined;
  var search = query ? stringify(query, route, opts) : '';

  if (route.query && !matchQuery(search, route.query, route, opts)) {
    throw new Error('[rudy] invalid query object');
  }

  if (route.hash !== undefined && matchHash(hash, route.hash, route, opts) == null) {
    throw new Error('[rudy] invalid hash value');
  }

  toPathCache[path] = toPathCache[path] || compile(path);
  var toPath = toPathCache[path];
  var p = toPath(params);
  var s = search ? "?".concat(search) : '';
  var h = hash ? "#".concat(hash) : '';
  return p + s + h;
});

var stringify = function stringify(query, route, opts) {
  var search = (route.stringifyQuery || opts.stringifyQuery)(query);

  if (process.env.NODE_ENV === 'development' && search.length > 2000) {
    // https://stackoverflow.com/questions/812925/what-is-the-maximum-possible-length-of-a-query-string
    // eslint-disable-next-line no-console
    console.error("[rudy] query is too long: ".concat(search.length, " chars (max: 2000)"));
  }

  return search;
};
//# sourceMappingURL=compileUrl.js.map