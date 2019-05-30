"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var env = process.env.NODE_ENV;

var _default = function _default(req) {
  var history = req.history,
      has = req.has,
      dispatch = req.dispatch,
      payload = req.action.payload;

  if (env === 'development' && !has('pathlessRoute')) {
    throw new Error('[rudy] "pathlessRoute" middleware is required to use history action creators.');
  }

  var method = payload.method,
      args = payload.args;
  if (method === 'set') return handleEdgeCaseForSet(req, args);
  var action = history[method].apply(history, _toConsumableArray(args).concat([false]));
  return dispatch(action);
}; // only state can be set before route change is committed,
// as otherwise the prev URL would change and break BrowserHistory entries tracking
// NOTE: we could greatly change the implementation to support this small thing, but its not worth the complexity;
// even just supporting setState on a previous route (while in the pipeline) is frill, but we'll soon see if people
// get use out of it.


exports.default = _default;

var handleEdgeCaseForSet = function handleEdgeCaseForSet(_ref, args) {
  var ctx = _ref.ctx,
      tmp = _ref.tmp,
      commitDispatch = _ref.commitDispatch,
      history = _ref.history;

  if (ctx.pending && !tmp.committed) {
    if (!isOnlySetState(args[0])) {
      throw new Error('[rudy] you can only set state on a previous url before enter');
    } // mutable workaround to insure state is applied to ongoing action


    var prevState = ctx.pending.action.location.prev.state;
    Object.assign(prevState, args[0].state);
  }

  var _history$set = history.set.apply(history, _toConsumableArray(args).concat([false])),
      commit = _history$set.commit,
      action = _objectWithoutProperties(_history$set, ["commit"]); // unlike other actions, sets go straight to reducer (and browser history) and skip pipeline.
  // i.e. it's purpose is to be a "hard" set


  commitDispatch(action);
  action._dispatched = true; // insure autoDispatch is prevented since its dispatched already here (similar to the implementation of `request.dispatch`)

  return commit(action).then(function () {
    return action;
  });
};

var isOnlySetState = function isOnlySetState(action) {
  return action.state && Object.keys(action).length === 1;
};
//# sourceMappingURL=callHistory.js.map