function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import pathToRegexp from 'path-to-regexp';
import { urlToLocation } from './index';
export default (function (loc, matchers) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var route = arguments.length > 3 ? arguments[3] : undefined;
  var opts = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var _urlToLocation = urlToLocation(loc),
      pathname = _urlToLocation.pathname,
      search = _urlToLocation.search,
      h = _urlToLocation.hash;

  var _matchPath = matchPath(pathname, matchers.path, options),
      match = _matchPath.match,
      keys = _matchPath.keys;

  if (!match) return null;
  var query = matchQuery(search, matchers.query, route, opts);
  if (!query) return null;
  var hash = matchHash(h, matchers.hash, route, opts);
  if (hash === null) return null;

  var _match = _toArray(match),
      path = _match[0],
      values = _match.slice(1);

  var params = keys.reduce(function (_params, key, index) {
    if (key.repeat) {
      // Multi segment params come out as arrays of decoded segments
      // If optional multi segment params are not provided, an empty array
      _params[key.name] = values[index] ? values[index].split('/').map(decodeURIComponent) : [];
    } else {
      _params[key.name] = typeof values[index] === 'string' ? decodeURIComponent(values[index]) : undefined;
    }

    return _params;
  }, {});
  var formatParams = options.formatParams,
      formatQuery = options.formatQuery,
      formatHash = options.formatHash;
  return {
    params: formatParams ? formatParams(params, route, keys, opts) : params,
    query: formatQuery ? formatQuery(query, route, opts) : query,
    hash: formatHash ? formatHash(hash || '', route, opts) : hash || '',
    matchedPath: matchers.path === '/' && path === '' ? '/' : path,
    // the matched portion of the URL/path
    matchers: matchers,
    partial: !!options.partial // const url = matchers.path === '/' && path === '' ? '/' : path // the matched portion of the path
    // return {
    //   path: matchers.path,
    //   url, // called `url` instead of `path` for compatibility with React Router
    //   isExact: pathname === path,
    //   params: fromPath ? fromPath(params, route, opts) : params,
    //   query: fromSearch ? fromSearch(query, route, opts) : query,
    //   hash: fromHash ? fromHash(hash || '', route, opts) : (hash || '')
    // }

  };
});

var matchPath = function matchPath(pathname, matcher) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _compilePath = compilePath(matcher, options),
      re = _compilePath.re,
      keys = _compilePath.keys;

  var match = re.exec(pathname);
  if (!match || options.exact && match[0] !== pathname) return {};
  return {
    match: match,
    keys: keys
  };
};

export var matchQuery = function matchQuery(search, matcher, route, opts) {
  var query = search ? parseSearch(search, route, opts) : {};
  if (!matcher) return query;

  var matchFails = function matchFails(key) {
    return !matchVal(query[key], matcher[key], key, route, opts);
  };

  if (Object.keys(matcher).some(matchFails)) return null;
  return query;
};
export var matchHash = function matchHash() {
  var hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var expected = arguments.length > 1 ? arguments[1] : undefined;
  var route = arguments.length > 2 ? arguments[2] : undefined;
  var opts = arguments.length > 3 ? arguments[3] : undefined;
  if (expected === undefined) return hash;
  return matchVal(hash, expected, 'hash', route, opts) ? hash : null;
};
export var matchVal = function matchVal(val, // TODO: What flow-type is best for expected
// $FlowFixMe
expected, key, route, opts) {
  var type = _typeof(expected);

  if (type === 'boolean') {
    if (expected === true) {
      return val !== '' && val !== undefined;
    }

    return val === undefined || val === '';
  }

  if (type === 'string') {
    return expected === val;
  }

  if (type === 'function') {
    return key === 'hash' ? // $FlowFixMe
    expected(val, route, opts) : // $FlowFixMe
    expected(val, key, route, opts);
  }

  if (expected instanceof RegExp) {
    return expected.test(val);
  }

  return true;
};

var parseSearch = function parseSearch(search, route, opts) {
  if (queries[search]) return queries[search];
  var parse = route.parseSearch || opts.parseSearch;
  queries[search] = parse(search);
  return queries[search];
};

var queries = {};
var patternCache = {};
var cacheLimit = 10000;
var cacheCount = 0;

var compilePath = function compilePath(pattern) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$partial = options.partial,
      partial = _options$partial === void 0 ? false : _options$partial,
      _options$strict = options.strict,
      strict = _options$strict === void 0 ? false : _options$strict;
  var cacheKey = "".concat(partial ? 't' : 'f').concat(strict ? 't' : 'f');
  var cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});
  if (cache[pattern]) return cache[pattern];
  var keys = [];
  var re = pathToRegexp(pattern, keys, {
    end: !partial,
    strict: strict
  });
  var compiledPattern = {
    re: re,
    keys: keys
  };

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledPattern;
    cacheCount += 1;
  } // TODO: Not sure the best way to construct this one
  // $FlowFixMe


  return compiledPattern;
};
//# sourceMappingURL=matchUrl.js.map