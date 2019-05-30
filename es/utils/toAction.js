function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { actionToUrl, urlToAction } from './index';
// This will take anything you throw at it (a url string, action, or array: [url, state, key?])
// and convert it to a complete Rudy FSRA ("flux standard routing action").
// Standard Rudy practice is to convert incoming actions to their full URL form (url + state)
// and then convert that to a FSRA. THIS DOES BOTH STEPS IN ONE WHEN NECESSSARY (i.e. for actions).
export default (function (api, entry, st, k) {
  if (Array.isArray(entry)) {
    // entry as array of [url, state, key?]
    var _entry = _slicedToArray(entry, 3),
        url = _entry[0],
        state = _entry[1],
        key = _entry[2];

    return urlToAction(api, url, state, key);
  }

  if (_typeof(entry) === 'object') {
    // entry as action object
    var _key = entry.location && entry.location.key; // preserve existing key if existing FSRA


    var _actionToUrl = actionToUrl(entry, api),
        _url = _actionToUrl.url,
        _state = _actionToUrl.state;

    return urlToAction(api, _url, _state, _key);
  }

  return urlToAction(api, entry, st, k); // entry as url string
});
//# sourceMappingURL=toAction.js.map