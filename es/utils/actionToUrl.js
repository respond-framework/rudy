function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

import pathToRegexp from 'path-to-regexp';
import { applyStringDefault, applyObjectDefault } from './applyDefaults';
import { compileUrl, cleanBasename } from './index';
export default (function (action, api, prevRoute) {
  var routes = api.routes,
      opts = api.options;
  var type = action.type,
      params = action.params,
      query = action.query,
      state = action.state,
      hash = action.hash,
      basename = action.basename;
  var route = routes[type] || {};
  var path = _typeof(route) === 'object' ? route.path : route;
  var p = formatParams(params, route, opts) || {};
  var q = formatQuery(query, route, opts);
  var s = formatState(state, route, opts) || {};
  var h = formatHash(hash || '', route, opts);
  var bn = cleanBasename(basename);
  var isWrongBasename = bn && !opts.basenames.includes(bn);
  if (basename === '') s._emptyBn = true; // not cool kyle

  try {
    if (isWrongBasename) {
      throw new Error("[rudy] basename \"".concat(bn, "\" not in options.basenames"));
    } // path-to-regexp throws for failed compilations


    var pathname = compileUrl(path, p, q, h, route, opts) || '/';
    var url = bn + pathname;
    return {
      url: url,
      state: s
    };
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error("[rudy] unable to compile action \"".concat(type, "\" to URL"), action, e);
    } else if (process.env.NODE_ENV === 'test') {
      // eslint-disable-next-line no-console
      console.log("[rudy] unable to compile action \"".concat(type, "\" to URL"), action, e);
    }

    var base = isWrongBasename ? '' : bn;

    var _url = base + notFoundUrl(action, routes, opts, q, h, prevRoute);

    return {
      url: _url,
      state: s
    };
  }
});

var formatParams = function formatParams(params, route, opts) {
  params = applyObjectDefault(route.defaultParams || opts.defaultParams)(params, route, opts);

  if (params) {
    var keys = [];
    pathToRegexp(typeof route === 'string' ? route : route.path, keys);
    var newParams = {};
    var toPath = route.toPath || opts.toPath || defaultToPath;
    keys.forEach(function (_ref) {
      var name = _ref.name,
          repeat = _ref.repeat,
          optional = _ref.optional;

      if (!Object.prototype.hasOwnProperty.call(params, name)) {
        return;
      } // $FlowFixMe


      var val = params[name];
      var urlVal = toPath(val, {
        name: name.toString(),
        repeat: repeat,
        optional: optional
      }, route, opts);

      if (repeat) {
        if (!Array.isArray(urlVal)) {
          throw Error('toPath failed');
        }

        if (!optional && !urlVal.length) {
          throw Error('toPath failed');
        }

        urlVal.forEach(function (segment) {
          if (typeof segment !== 'string' || !segment) {
            throw Error('toPath failed');
          }
        });
      } else if (typeof urlVal !== 'string' && (!optional || urlVal !== undefined)) {
        throw Error('toPath failed');
      }

      newParams[name.toString()] = urlVal;
    });
    return newParams;
  }

  return undefined;
};

var toSegment = function toSegment(val, convertNum, capitalize, optional) {
  if (typeof val === 'number' && convertNum) {
    return val.toString();
  }

  if (typeof val !== 'string' || optional && !val) {
    throw TypeError('[rudy]: defaultToPath::toSegment received unknown type');
  }

  if (capitalize) {
    return val.replace(/ /g, '-').toLowerCase();
  }

  return val;
};

export var defaultToPath = function defaultToPath(val, _ref2, route, opts) {
  var repeat = _ref2.repeat,
      optional = _ref2.optional;
  var convertNum = route.convertNumbers || opts.convertNumbers && route.convertNumbers !== false;
  var capitalize = route.capitalizedWords || opts.capitalizedWords && route.capitalizedWords !== false;

  if (repeat) {
    if (optional && val === undefined) {
      return [];
    }

    if (!val) {
      throw Error('defaultToPath received incorrect value');
    }

    return val.split('/');
  }

  if (optional && val === undefined) {
    return undefined;
  }

  return toSegment(val, convertNum, capitalize, optional);
};
export var formatQuery = function formatQuery(query, route, opts) {
  query = applyObjectDefault(route.defaultQuery || opts.defaultQuery)(query, route, opts);
  var to = route.toSearch || opts.toSearch;

  if (to && query) {
    var newQuery = {};
    Object.keys(query).forEach(function (key) {
      // $FlowFixMe
      newQuery[key] = to(query[key], key, route, opts);
    });
    return newQuery;
  }

  return query;
};
export var formatHash = function formatHash(hash, route, opts) {
  hash = applyStringDefault(route.defaultHash || opts.defaultHash)(hash, route, opts);
  var to = route.toHash || opts.toHash;
  return to ? to(hash, route, opts) : hash;
};

var formatState = function formatState(state, route, opts) {
  return applyObjectDefault(route.defaultState || opts.defaultState)(state, route, opts);
}; // state has no string counter part in the address bar, so there is no `toState`


var notFoundUrl = function notFoundUrl(action, routes, opts, query, hash) {
  var prevRoute = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
  var type = action.type || '';
  var route = routes[type] || {};
  var hasScene = type.indexOf('/NOT_FOUND') > -1; // TODO: Look into scene stuff
  // $FlowFixMe

  var scene = route.scene || prevRoute.scene || '';
  var t = hasScene ? type : routes["".concat(scene, "/NOT_FOUND")] // try to interpret scene-level NOT_FOUND if available (note: links create plain NOT_FOUND actions)
  ? "".concat(scene, "/NOT_FOUND") : 'NOT_FOUND';
  var p = routes[t].path || routes.NOT_FOUND.path || ''; // preserve these (why? because we can)

  var s = query && opts.stringifyQuery ? "?".concat(opts.stringifyQuery(query)) : '';
  var h = hash ? "#".concat(hash) : '';
  return p + s + h;
};
//# sourceMappingURL=actionToUrl.js.map