export default (function (_ref) {
  var options = _ref.options;
  var shouldTransition = options.shouldTransition;

  options.shouldTransition = function (action, api) {
    if (typeof action === 'function') return true;
    return shouldTransition(action, api);
  };

  return function (req, next) {
    if (typeof req.action !== 'function') return next();
    var thunk = req.action;
    var thunkResult = Promise.resolve(thunk(req));
    return thunkResult.then(function (action) {
      return action && !action._dispatched ? req.dispatch(action) : action;
    });
  };
});
//# sourceMappingURL=anonymousThunk.js.map