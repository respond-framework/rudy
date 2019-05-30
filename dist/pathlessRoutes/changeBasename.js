"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(_ref) {
  var getLocation = _ref.getLocation,
      has = _ref.has,
      action = _ref.action,
      dispatch = _ref.dispatch;
  var env = process.env.NODE_ENV;

  if (env === 'development' && !has('pathlessRoute')) {
    throw new Error('[rudy] "pathlessRoute" middleware is required to use "changeBasename" action creator without passing an action.');
  }

  var _getLocation = getLocation(),
      type = _getLocation.type,
      params = _getLocation.params,
      query = _getLocation.query,
      state = _getLocation.state,
      hash = _getLocation.hash;

  var basename = action.payload.basename;
  return dispatch({
    type: type,
    params: params,
    query: query,
    state: state,
    hash: hash,
    basename: basename
  });
};

exports.default = _default;
//# sourceMappingURL=changeBasename.js.map