export default (function (middlewares, curryArg) {
  var killOnRedirect = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (typeof middlewares === 'function') {
    return middlewares(curryArg, killOnRedirect); // accept custom function to do compose work below
  }

  var pipeline = curryArg ? middlewares.map(function (middleware) {
    return middleware(curryArg);
  }) : middlewares;
  return function (req) {
    var index = -1; // last called middleware #

    var result;
    return dispatch(0);

    function dispatch(i) {
      if (req.redirect !== undefined && killOnRedirect) {
        // short-circuit, dont call next middleware
        var ret = i === 0 && result !== undefined ? result : false;
        return Promise.resolve(ret);
      }

      if (req.tmp.canceled) {
        // if a new request comes in before this one commits/enters, cancel it by not calling next middleware
        var _ret = i === 0 && result !== undefined ? result : false;

        req.history.canceled = req.action;
        return Promise.resolve(_ret); // short-circuit, dont call next middleware
      } // start standard work:


      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'));
      }

      index = i;
      var fn = pipeline[i];
      if (!fn) return Promise.resolve(result);

      try {
        var next = function next() {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return Promise.resolve(dispatch.apply(void 0, [i + 1].concat(args)));
        };

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var prom = Promise.resolve(fn.apply(void 0, [req, next].concat(args))); // insure middleware is a promise

        return prom.then(function (res) {
          if (res) {
            delete res._dispatched; // delete these temporary flags so user doesn't see them (used for `autoDispatch` feature)
          } // return value of redirect (resolution of next pipeline), but if value returned from callback, return that instead


          if (req.redirect !== undefined && killOnRedirect) {
            return result = result !== undefined ? result // as below in the standard use-case, this insures last middleware dictates return
            : res === req.action ? req.redirect // `transformAction` + `enter` middleware return original action dispatched, but we never want to return that value of the action redirected from
            : res !== undefined ? res : req.redirect; // usually the result returned will be the result of the pipeline redirected to, but we honor explicit different returns (`res`)
          } // if a middleware return `false`, the pipeline is terminated and now there is no longer a "pending" route change


          if (res === false && !req.tmp.committed) {
            var newRequestCameIn = req.ctx.pending !== req;
            req.ctx.pending = newRequestCameIn ? req.ctx.pending : false; // preserve potential incoming request that came in during async callback that returned false, otherwise indicate the initial request is no longer pending
            // call window.history.go(-1 | 1) to go back to URL/route whose `beforeLeave` returned `false`
            // NOTE: this is also used by redirects back to the current route (see `middleware/call/index.js`)

            if (req.tmp.revertPop) req.tmp.revertPop();
          }

          result = result !== undefined ? result : res; // insure last middleware return stays the final return of `dispatch` after chain rewinds

          return i === 0 ? result : res; // but allow middleware calls to `next` to be returned regular return of next middleware
        });
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
});
//# sourceMappingURL=compose.js.map