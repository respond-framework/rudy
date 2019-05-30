import { redirect } from '@respond-framework/rudy';
export default (function (action, routes, shouldDispatch, dispatch, onClick, target, isRedirect, fullUrl, history, e) {
  var prevented = e.defaultPrevented;
  var notModified = !isModified(e);
  var shouldGo = true;

  if (onClick) {
    shouldGo = onClick(e) !== false; // onClick can return false to prevent dispatch
  }

  if (!target && e && e.preventDefault && notModified) {
    e.preventDefault();
  }

  if (action && shouldGo && shouldDispatch && !target && !prevented && notModified && e.button === 0) {
    action = isRedirect ? redirect(action) : action;
    return dispatch(action);
  }

  if (!action && !target && fullUrl.indexOf('http') === 0) {
    if (history.index === 0) {
      history.saveHistory(history.location, true); // used to patch an edge case, see `history/utils/sessionStorage.js.getIndexAndEntries`
    }

    window.location.href = fullUrl;
  }

  return undefined;
});

var isModified = function isModified(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
};
//# sourceMappingURL=handlePress.js.map