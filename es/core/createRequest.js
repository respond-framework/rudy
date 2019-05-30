function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { BLOCK, UNBLOCK, SET_FROM, CALL_HISTORY } from '../types';
import { redirect } from '../actions';
import { isAction, createActionRef } from '../utils';
export default (function (action, api, next) {
  return new Request(action, api, next);
});
export var Request = function Request(_action, api, next) {
  var _this = this;

  _classCallCheck(this, Request);

  _defineProperty(this, "tmp", void 0);

  _defineProperty(this, "action", void 0);

  _defineProperty(this, "ctx", void 0);

  _defineProperty(this, "route", void 0);

  _defineProperty(this, "prevRoute", void 0);

  _defineProperty(this, "error", void 0);

  _defineProperty(this, "scene", void 0);

  _defineProperty(this, "realDispatch", void 0);

  _defineProperty(this, "commitDispatch", void 0);

  _defineProperty(this, "commitHistory", void 0);

  _defineProperty(this, "history", void 0);

  _defineProperty(this, "routes", void 0);

  _defineProperty(this, "redirect", void 0);

  _defineProperty(this, "getLocation", void 0);

  _defineProperty(this, "last", void 0);

  _defineProperty(this, "canceled", void 0);

  _defineProperty(this, "type", void 0);

  _defineProperty(this, "enter", function () {
    _this.ctx.pending = false;
    _this.tmp.committed = true;
    _this.history.pendingPop = null;
    return Promise.resolve(_this.commitDispatch(_this.action)) // syncronous 99% percent of the time (state needs to be updated before history updates URL etc)
    .then(function (res) {
      if (!_this.commitHistory) return res;
      return _this.commitHistory(_this.action).then(function () {
        return res;
      });
    });
  });

  _defineProperty(this, "dispatch", function (action) {
    var dispatch = _this.realDispatch;
    var type = action && action.type; // actions as payloads (which can be `null`) allowed

    var route = _this.routes[type];
    var linkPipelines = route || typeof action === 'function';

    if (linkPipelines) {
      action.tmp = _this.tmp; // keep the same `tmp` object across all redirects (or potential redirects in anonymous thunks)

      if (_this.ctx.busy) {
        // keep track of previous action to properly replace instead of push during back/next redirects
        // while setting to `state.from`. See `middleware/transformAction/utils/formatAction.js`
        action.tmp.from = _this.tmp.from || _this.action;
      }
    }

    if (_this.ctx.busy && route && route.path && // convert actions to redirects only if "busy" in a route changing pipeline
    !(action.location && action.location.kind === 'set') // history `set` actions should not be transformed to redirects
    ) {
        var status = action.location && action.location.status;
        action = redirect(action, status || 302);
      }

    if (typeof action !== 'function') {
      if (!_this._start) {
        action = _this.populateAction(action, _this); // automatically turn payload-only actions into real actions with routeType_COMPLETE|_DONE as type
      } else if (_this._start) {
        // a callback immediately before `enter` has the final action/payload dispatched attached
        // to the payload of the main route action, to limit the # of actions dispatched.
        // NOTE: requires this middleware: `[call('beforeThunk', { start: true }), enter]`
        _this.action.payload = action;
        return Promise.resolve(action);
      }
    }

    var oldUrl = _this.getLocation().url;

    return Promise.resolve(dispatch(action)) // dispatch transformed action
    .then(function (res) {
      var urlChanged = oldUrl !== _this.getLocation().url;

      if (_this.ctx.serverRedirect || // short-circuit when a server redirected is detected
      (urlChanged || action.type === CALL_HISTORY) && // short-circuit if the URL changed || or history action creators used
      !(res && res.location && res.location.kind === 'set') // but `set` should not short-circuit ever
      ) {
          _this.redirect = res; // assign action to `this.redirect` so `compose` can properly short-circuit route redirected from and resolve to the new action (NOTE: will capture nested pathlessRoutes + anonymousThunks)
        }

      if (res) res._dispatched = true; // tell `middleware/call/index.js` to NOT automatically dispatch callback returns

      return res;
    });
  });

  _defineProperty(this, "confirm", function () {
    var canLeave = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    delete _this.ctx.confirm;

    if (!canLeave) {
      return _this.realDispatch({
        type: UNBLOCK
      });
    } // When `false` is returned from a `call` middleware, you can use `req.confirm()` or the corresponding action
    // creator to run the action successfully through the pipeline again, as in a confirmation modal.
    // All we do is temporarily delete the blocking callback and replace it after the action
    // is successfully dispatched.
    //
    // See `middleware/call/index.js` for where the below assignments are made.


    var _this$last = _this.last,
        name = _this$last.name,
        prev = _this$last.prev;
    var route = prev ? _this.prevRoute : _this.route;
    var callback = route[name];
    delete route[name];
    return _this.realDispatch(_this.action).then(function (res) {
      route[name] = callback; // put callback back

      if (res) res._dispatched = true;
      return res;
    });
  });

  _defineProperty(this, "block", function () {
    _this.ctx.confirm = _this.confirm;
    var ref = createActionRef(_this.action);
    return _this.realDispatch({
      type: BLOCK,
      payload: {
        ref: ref
      }
    });
  });

  _defineProperty(this, "getKind", function () {
    if (_this.tmp.load) return 'load';
    return _this.action.location && _this.action.location.kind;
  });

  _defineProperty(this, "isUniversal", function () {
    return _this.getLocation().universal;
  });

  _defineProperty(this, "isDoubleDispatch", function () {
    return _this.action.location.url === _this.getLocation().url && !/load|reset|jump/.test(_this.getKind());
  });

  _defineProperty(this, "handleDoubleDispatch", function () {
    _this.ctx.pending = false;
    _this.history.pendingPop = null;
    if (!_this.tmp.from) return _this.action; // primary use case
    // below is code related to occuring during a redirect (i.e. because `this.tmp.from` exists)

    _this.ctx.doubleDispatchRedirect = _this.action; // if it happens to be within a route-changing pipline that redirects, insure the parent pipeline short-circuits while setting `state.from` (see below + `call/index.js`)

    if (_this.tmp.revertPop) _this.tmp.revertPop();
    return _this.action;
  });

  _defineProperty(this, "handleDoubleDispatchRedirect", function (res) {
    var attemptedAction = _this.ctx.doubleDispatchRedirect;
    delete _this.ctx.doubleDispatchRedirect;
    _this.canceled = true;
    var ref = _this.action.type === CALL_HISTORY ? createActionRef(attemptedAction.location.from) // when history action creators are used in pipeline, we have to address this from the perspective of the `callHistory` middleware
    : createActionRef(_this.action);

    _this.realDispatch({
      type: SET_FROM,
      payload: {
        ref: ref
      }
    });

    return res !== undefined ? res : attemptedAction;
  });

  _defineProperty(this, "populateAction", function (act) {
    var type;
    var action = isAction(act) ? act : typeof act === 'string' && (type = _this.isActionType(act)) ? {
      type: type
    } : {
      payload: act
    };
    action.type = action.type || (_this.tmp.committed ? "".concat(_this.type, "_COMPLETE") : "".concat(_this.type, "_DONE"));
    return action;
  });

  _defineProperty(this, "isActionType", function (str) {
    if (_this.routes[str]) return str;
    if (_this.routes["".concat(_this.scene, "/").concat(str)]) return str;
    if (/^[A-Z0-9_/]+$/.test(str)) return str;
    if (str.indexOf('@@') === 0) return str;
  });

  var routes = api.routes,
      options = api.options,
      getLocation = api.getLocation,
      ctx = api.ctx;
  var isNewPipeline = !_action.tmp;
  var pendingRequest = ctx.pending;

  var _getLocation = getLocation(),
      kind = _getLocation.kind,
      _type = _getLocation.type,
      _prev = _getLocation.prev;

  var _route = routes[_action.type] || {};

  var isRouteAction = !!_route.path;
  var prevRoute = kind === 'init' ? routes[_prev.type] || {} : routes[_type]; // the `tmp` context is passed along by all route-changing actions in the same primary parent
  // pipeline to keep track of things like `committed` status, but we don't want the
  // resulting action that leaves Rudy to have this, so we delete it.

  var tmp = this.tmp = _action.tmp || {};
  delete _action.tmp; // delete it so it's never seen outside of pipeline

  tmp.load = tmp.load || _action.location && _action.location.kind === 'load';
  ctx.busy = ctx.busy || isRouteAction; // maintain `busy` status throughout a primary parent route changing pipeline even if there are pathlessRoutes, anonymousThunks (which don't have paths) called by them
  // cancel pending not committed requests if new ones quickly come in

  if (isRouteAction) {
    if (pendingRequest && isNewPipeline) {
      pendingRequest.tmp.canceled = true; // `compose` will return early on pending requests, effectively cancelling them

      pendingRequest.tmp.revertPop && pendingRequest.tmp.revertPop(); // cancel any actions triggered by browser pops
    }

    ctx.pending = this;
  }

  Object.assign(this, options.extra);
  Object.assign(this, _action); // destructure action into request for convenience in callbacks

  Object.assign(this, api, {
    dispatch: this.dispatch
  });
  this.action = _action;
  this.ctx = ctx;
  this.route = _route;
  this.prevRoute = prevRoute;
  this.error = null;
  this.scene = _route.scene || '';
  this.realDispatch = api.dispatch;
  this.commitDispatch = next; // standard redux next dispatch from our redux middleware

  this.commitHistory = _action.commit; // commitHistory is supplied by history-generated actions. Otherwise it will be added soon by the `transformAction` middleware
  // available when browser back/next buttons used. It's used in 3 cases:
  // 1) when you return `false` from a route triggered by the browser back/next buttons (See `core/compose.js`)
  // 2) in `transformAction/index.js` when popping to a route that redirects to the current URL (yes, we're on top of edge cases!)
  // 3) when a pop-triggered action is canceled (see above)

  this.tmp.revertPop = this.tmp.revertPop || _action.revertPop;
};
//# sourceMappingURL=createRequest.js.map