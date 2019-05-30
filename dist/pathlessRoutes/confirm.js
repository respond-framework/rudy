"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(req) {
  var ctx = req.ctx,
      action = req.action,
      has = req.has;
  var env = process.env.NODE_ENV;

  if (env === 'development' && !has('pathlessRoute')) {
    throw new Error('[rudy] "pathlessRoute" middleware is required to use "confirm" action creator.');
  }

  req._dispatched = true;
  var canLeave = action.payload.canLeave;
  return ctx.confirm(canLeave);
};

exports.default = _default;
//# sourceMappingURL=confirm.js.map