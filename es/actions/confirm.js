import { CONFIRM } from '../types';
export default (function () {
  var canLeave = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  return {
    type: CONFIRM,
    payload: {
      canLeave: canLeave
    }
  };
}); // NOTE: see `src/utils/formatRoutes.js` for implementation of corresponding pathlessRoute
//# sourceMappingURL=confirm.js.map