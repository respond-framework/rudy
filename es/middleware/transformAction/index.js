import { formatAction } from './utils';
export default (function () {
  return function (req, next) {
    if (!req.route.path) return next();
    req.action = formatAction(req);
    if (req.isDoubleDispatch()) return req.handleDoubleDispatch(); // don't dispatch the same action twice

    var _req$action = req.action,
        type = _req$action.type,
        params = _req$action.params,
        query = _req$action.query,
        state = _req$action.state,
        hash = _req$action.hash,
        basename = _req$action.basename,
        location = _req$action.location;
    Object.assign(req, {
      type: type,
      params: params,
      query: query,
      state: state,
      hash: hash,
      basename: basename,
      location: location
    }); // assign to `req` for conevenience (less destructuring in callbacks)

    return next().then(function () {
      return req.action;
    });
  };
});
//# sourceMappingURL=index.js.map