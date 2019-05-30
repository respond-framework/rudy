import { isNotFound, typeToScene, formatRoute } from '../../utils';
export default (function (r, type, routes, formatter) {
  var route = formatRoute(r, type, routes, formatter);
  route.scene = typeToScene(type); // set default path for NOT_FOUND actions if necessary

  if (!route.path && isNotFound(type)) {
    route.path = route.scene ? // $FlowFixMe
    "/".concat(r.scene.toLowerCase(), "/not-found") : '/not-found';
  }

  return route;
});
//# sourceMappingURL=formatRoute.js.map