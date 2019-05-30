function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

import resolvePathname from 'resolve-pathname';
import { actionToUrl, toAction, findBasename, stripBasename } from '@respond-framework/rudy';
export default (function (to, routes) {
  var basename = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var currentPathname = arguments.length > 3 ? arguments[3] : undefined;
  var options = arguments.length > 4 ? arguments[4] : undefined;
  var basenames = options.basenames;
  var url = '';
  var action;

  if (!to) {
    url = '#';
  }

  if (to && typeof to === 'string') {
    url = to;
  } else if (Array.isArray(to)) {
    if (to[0].charAt(0) === '/') {
      basename = to.shift();
    }

    url = "/".concat(to.join('/'));
  } else if (_typeof(to) === 'object') {
    action = to;

    try {
      ;

      var _actionToUrl = actionToUrl(action, {
        routes: routes,
        options: options
      });

      url = _actionToUrl.url;
      basename = action.basename || basename || '';
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('[rudy/Link] could not create path from action:', action);
      }

      url = '#';
    }
  }

  var bn = basenames && findBasename(url, basenames);

  if (bn) {
    basename = bn;
    url = stripBasename(url, bn);
  }

  if (url.charAt(0) === '#') {
    url = "".concat(currentPathname).concat(url);
  } else if (url.charAt(0) !== '/') {
    url = resolvePathname(url, currentPathname);
  }

  var isExternal = url.indexOf('http') === 0;

  if (!action && !isExternal) {
    var api = {
      routes: routes,
      options: options
    };
    action = toAction(api, url);
  }

  if (basename) {
    action = _objectSpread({}, action, {
      basename: basename
    });
  }

  var fullUrl = isExternal ? url : basename + url;
  return {
    fullUrl: fullUrl,
    action: action
  };
});
//# sourceMappingURL=toUrlAndAction.js.map