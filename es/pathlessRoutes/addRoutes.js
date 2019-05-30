import { enhanceRoutes } from '../middleware/call/utils'; // unfortunate coupling (to potentially optional middleware)

import { formatRoutes } from '../utils';
export default (function (req) {
  var action = req.action,
      options = req.options,
      allRoutes = req.routes,
      has = req.has;
  var env = process.env.NODE_ENV;

  if (env === 'development' && !has('pathlessRoute')) {
    throw new Error('[rudy] "pathlessRoute" middleware is required to use "addRoutes" action creator.');
  }

  var _action$payload = action.payload,
      routes = _action$payload.routes,
      formatRoute = _action$payload.formatRoute;
  var formatter = formatRoute || options.formatRoute;
  var newRoutes = formatRoutes(routes, formatter, true);
  var callbacks = options.callbacks || [];
  callbacks.forEach(function (name) {
    return enhanceRoutes(name, newRoutes, options);
  });
  Object.assign(allRoutes, newRoutes);
  action.payload.routes = newRoutes;
  action.payload.routesAdded = Object.keys(routes).length; // we need something to triggering updating of Link components when routes added

  req.commitDispatch(action);
});
//# sourceMappingURL=addRoutes.js.map