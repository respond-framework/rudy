import { PREFIX } from '../types';
export default (function (action, _ref) {
  var routes = _ref.routes;
  var _action$type = action.type,
      type = _action$type === void 0 ? '' : _action$type;
  var route = routes[type];
  return route || type.indexOf(PREFIX) > -1;
});
//# sourceMappingURL=shouldTransition.js.map