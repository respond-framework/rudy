import BrowserHistory from '../history/BrowserHistory';
import MemoryHistory from '../history/MemoryHistory';
import { supportsHistory, supportsDom } from '../history/utils';
export default (function (routes) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return supportsDom() && supportsHistory() && opts.testBrowser !== false ? new BrowserHistory(routes, opts) : new MemoryHistory(routes, opts);
});
//# sourceMappingURL=createHistory.js.map