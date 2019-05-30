import { CLEAR_CACHE } from '../types';
export default (function (invalidator, options) {
  return {
    type: CLEAR_CACHE,
    payload: {
      invalidator: invalidator,
      options: options
    }
  };
}); // NOTE: see `src/utils/formatRoutes.js` for implementation of corresponding pathlessRoute
//# sourceMappingURL=clearCache.js.map