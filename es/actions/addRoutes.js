import { ADD_ROUTES } from '../types';
export default (function (routes, formatRoute) {
  return {
    type: ADD_ROUTES,
    payload: {
      routes: routes,
      formatRoute: formatRoute
    }
  };
}); // NOTE: see `src/utils/formatRoutes.js` for implementation of corresponding pathlessRoute
//# sourceMappingURL=addRoutes.js.map