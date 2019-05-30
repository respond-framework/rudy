import { isServer } from '@respond-framework/utils';
import { isRedirect, actionToUrl } from '../utils';
export default (function (api) {
  return function (req, next) {
    if (isServer() && isRedirect(req.action)) {
      var action = req.action;

      var _actionToUrl = actionToUrl(action, api),
          url = _actionToUrl.url;

      action.url = action.location.url = url;
      action.status = action.location.status || 302; // account for anonymous thunks potentially redirecting without returning itself
      // and not able to be discovered by regular means in `utils/createRequest.js`

      req.ctx.serverRedirect = true;
      return action;
    }

    return next();
  };
});
//# sourceMappingURL=serverRedirect.js.map