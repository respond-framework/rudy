import { isRedirect } from './index';
export default (function (action, redirectFunc) {
  if (isRedirect(action)) {
    var url = action.location.url;
    var status = action.location.status || 302;

    if (typeof redirectFunc === 'function') {
      redirectFunc(status, url, action);
    } else if (redirectFunc && typeof redirectFunc.redirect === 'function') {
      redirectFunc.redirect(status, url);
    }

    return true;
  }

  return false;
});
//# sourceMappingURL=doesRedirect.js.map