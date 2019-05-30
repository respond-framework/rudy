function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { CHANGE_BASENAME } from '../types';
export default (function (basename, action) {
  if (!action) {
    return {
      type: CHANGE_BASENAME,
      payload: {
        basename: basename
      }
    };
  }

  return _objectSpread({}, action, {
    basename: basename
  });
}); // NOTE: the first form with type `CHANGE_BASENAME` will trigger the pathlessRoute middleware
// see `src/utils/formatRoutes.js` for implementation of corresponding pathlessRoute
//# sourceMappingURL=changeBasename.js.map