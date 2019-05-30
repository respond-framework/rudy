function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { toAction, toEntries, createActionRef, cleanBasename, isAction } from '../utils';
import { createPrevEmpty } from '../core/createReducer';

var History =
/*#__PURE__*/
function () {
  function History(routes) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, History);

    this.routes = routes;
    this.options = options;
    options.basenames = (options.basenames || []).map(function (bn) {
      return cleanBasename(bn);
    });
    var kind = 'load';

    var _this$_restore = this._restore(),
        n = _this$_restore.n,
        index = _this$_restore.index,
        entries = _this$_restore.entries; // delegate to child classes to restore


    var action = entries[index];
    var info = {
      kind: kind,
      n: n,
      index: index,
      entries: entries
    };

    var commit = function commit() {}; // action already committed, by virtue of browser loading the URL


    this.firstAction = this._notify(action, info, commit, false);
  } // CORE:


  _createClass(History, [{
    key: "listen",
    value: function listen(dispatch, getLocation) {
      var _this = this;

      this.dispatch = dispatch;
      this.getLocation = getLocation;
      return function () {
        return _this.unlisten();
      };
    }
  }, {
    key: "unlisten",
    value: function unlisten() {
      this.dispatch = null;
    }
  }, {
    key: "_notify",
    value: function _notify(action, info, commit) {
      var notify = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var extras = arguments.length > 4 ? arguments[4] : undefined;
      var index = info.index,
          entries = info.entries,
          n = info.n;
      var n2 = n || (index > this.index ? 1 : index === this.index ? this.n : -1);
      var length = entries.length;
      action = _objectSpread({}, action, extras, {
        commit: this._once(commit),
        location: _objectSpread({}, action.location, info, {
          length: length,
          n: n2
        })
      });
      if (notify && this.dispatch) return this.dispatch(action);
      return action;
    } // LOCATION STATE GETTERS (single source of truth, unidirectional):

  }, {
    key: "push",
    // API:
    value: function push(path) {
      var _this2 = this;

      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : path.state || {};
      var notify = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var action = toAction(this, path, state);

      var n = this._findAdjacentN(action); // automatically determine if the user is just going back or next to a URL already visited


      if (n) return this.jump(n, false, undefined, {
        state: state
      }, notify);
      var kind = n === -1 ? 'back' : n === 1 ? 'next' : 'push';
      var index = n === -1 ? this.index - 1 : this.index + 1;

      var entries = this._pushToFront(action, this.entries, index, kind);

      var info = {
        kind: kind,
        index: index,
        entries: entries
      };
      var awaitUrl = this.url;

      var commit = function commit(action) {
        return _this2._push(action, awaitUrl);
      };

      return this._notify(action, info, commit, notify);
    }
  }, {
    key: "replace",
    value: function replace(path) {
      var _this3 = this;

      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : path.state || {};
      var notify = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var action = toAction(this, path, state);

      var n = this._findAdjacentN(action); // automatically determine if the user is just going back or next to a URL already visited


      if (n) return this.jump(n, false, undefined, {
        state: state
      }, notify);
      var kind = n === -1 ? 'back' : n === 1 ? 'next' : 'replace';
      var index = this.index;
      var entries = this.entries.slice(0);
      var info = {
        kind: kind,
        entries: entries,
        index: index
      };
      var currUrl = this.url;

      var commit = function commit(action) {
        return _this3._replace(action, currUrl);
      };

      entries[index] = action;
      return this._notify(action, info, commit, notify);
    }
  }, {
    key: "jump",
    value: function jump(delta) {
      var _this4 = this;

      var byIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var n = arguments.length > 2 ? arguments[2] : undefined;
      var act = arguments.length > 3 ? arguments[3] : undefined;
      var notify = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
      var revertPop = arguments.length > 5 ? arguments[5] : undefined;
      delta = this._resolveDelta(delta, byIndex);
      n = n || (delta < 0 ? -1 : 1); // users can choose what direction to make the `jump` look like it came from

      var kind = delta === -1 ? 'back' : delta === 1 ? 'next' : 'jump'; // back/next kinds are just more specifically named jumps

      var isMovingAdjacently = kind !== 'jump';
      var isPop = !!revertPop; // passed by BrowserHistory's `handlePop`

      var index = this.index + delta;
      var entries = this.entries.slice(0);

      if (!this.entries[index]) {
        throw new Error("[rudy] jump() - no entry at index: ".concat(index, "."));
      }

      var action = entries[index] = this._transformEntry(this.entries[index], act);

      var info = {
        kind: kind,
        index: index,
        entries: entries,
        n: n
      };
      var currentEntry = isMovingAdjacently && this.entries[this.index]; // for `replace` to adjacent entries we need to override `prev` to be the current entry; `push` doesn't have this issue, but their `prev` value is the same

      var prev = this._createPrev(info, currentEntry); // jumps can fake the value of `prev` state


      var currUrl = this.url;
      var oldUrl = this.entries[index].location.url;

      var commit = function commit(action) {
        return _this4._jump(action, currUrl, oldUrl, delta, isPop);
      };

      return this._notify(action, info, commit, notify, {
        prev: prev,
        revertPop: revertPop
      });
    }
  }, {
    key: "back",
    value: function back(state) {
      var notify = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      return this.jump(-1, false, -1, {
        state: state
      }, notify);
    }
  }, {
    key: "next",
    value: function next(state) {
      var notify = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      return this.jump(1, false, 1, {
        state: state
      }, notify);
    }
  }, {
    key: "set",
    value: function set(act, delta) {
      var _this5 = this;

      var byIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var notify = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      delta = this._resolveDelta(delta, byIndex);
      var kind = 'set';
      var index = this.index;
      var i = this.index + delta;
      var entries = this.entries.slice(0);

      if (!this.entries[i]) {
        throw new Error("[rudy] set() - no entry at index: ".concat(i));
      }

      var entry = entries[i] = this._transformEntry(this.entries[i], act);

      var action = delta === 0 ? entry : createActionRef(this.location); // action dispatched must ALWAYS be current one, but insure it receives changes if delta === 0, not just entry in entries

      var info = {
        kind: kind,
        index: index,
        entries: entries
      };
      var oldUrl = delta === 0 ? this.url : this.entries[i].location.url; // this must be the current URL for the target so that `BrowserHistory` url awaiting works, as the target's URL may change in `this._transformEntry`

      var commit = function commit(action) {
        return _this5._set(action, oldUrl, delta);
      };

      if (i === this.location.prev.location.index) {
        action.prev = _objectSpread({}, entry, {
          location: _objectSpread({}, entry.location, {
            index: i
          }) // edge case: insure `state.prev` matches changed entry IF CHANGED ENTRY HAPPENS TO ALSO BE THE PREV

        });
      }

      return this._notify(action, info, commit, notify);
    }
  }, {
    key: "replacePop",
    value: function replacePop(path) {
      var _this6 = this;

      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var notify = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var info = arguments.length > 3 ? arguments[3] : undefined;
      var action = toAction(this, path, state);
      var index = info.index,
          prevUrl = info.prevUrl,
          n = info.n;
      var entries = info.entries.slice(0);
      var kind = index < this.index ? 'back' : 'next';
      var newInfo = {
        kind: kind,
        entries: entries,
        index: index
      };

      var commit = function commit(action) {
        return _this6._replace(action, prevUrl, n);
      };

      entries[index] = action;
      return this._notify(action, newInfo, commit, notify);
    }
  }, {
    key: "reset",
    value: function reset(ents, i, n) {
      var _this7 = this;

      var notify = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      if (ents.length === 1) {
        var entry = this._findResetFirstAction(ents[0]); // browser must always have at least 2 entries, so one can be pushed, erasing old entries from the stack


        ents.unshift(entry);
      }

      i = i !== undefined ? i : ents.length - 1;
      n = n || (i !== ents.length - 1 ? i > this.index ? 1 : i === this.index ? this.n : -1 // create direction relative to index of current entries
      : 1); // at the front of the array, always use "forward" direction

      var kind = 'reset';

      var _toEntries = toEntries(this, ents, i, n),
          index = _toEntries.index,
          entries = _toEntries.entries;

      var action = _objectSpread({}, entries[index]);

      var info = {
        kind: kind,
        index: index,
        entries: entries,
        n: n
      };
      var oldUrl = this.url;
      var oldFirstUrl = this.entries[0].location.url;
      var reverseN = -this.index;

      var commit = function commit(action) {
        return _this7._reset(action, oldUrl, oldFirstUrl, reverseN);
      };

      if (!entries[index]) throw new Error("[rudy] no entry at index: ".concat(index, "."));

      var prev = this._createPrev(info);

      var from = index === this.index && createActionRef(this.location); // if index stays the same, treat as "replace"

      return this._notify(action, info, commit, notify, {
        prev: prev,
        from: from
      });
    }
  }, {
    key: "canJump",
    value: function canJump(delta, byIndex) {
      delta = this._resolveDelta(delta, byIndex);
      return !!this.entries[this.index + delta];
    } // UTILS:

  }, {
    key: "_transformEntry",
    value: function _transformEntry(entry, action) {
      entry = _objectSpread({}, entry);

      if (typeof action === 'function') {
        return toAction(this, action(entry));
      }

      action = isAction(action) ? action : {
        state: action
      };
      var _action = action,
          params = _action.params,
          query = _action.query,
          state = _action.state,
          hash = _action.hash,
          bn = _action.basename;

      if (params) {
        params = typeof params === 'function' ? params(entry.query) : params;
        entry.params = _objectSpread({}, entry.params, params);
      }

      if (query) {
        query = typeof query === 'function' ? query(entry.query) : query;
        entry.query = _objectSpread({}, entry.query, query);
      }

      if (state) {
        state = typeof state === 'function' ? state(entry.state) : state;
        entry.state = _objectSpread({}, entry.state, state);
      }

      if (hash) {
        hash = typeof hash === 'function' ? hash(entry.hash) : hash;
        entry.hash = hash;
      }

      if (bn) {
        bn = typeof bn === 'function' ? bn(entry.basename) : bn;
        entry.basename = bn;
      }

      return toAction(this, entry);
    }
  }, {
    key: "_createPrev",
    value: function _createPrev(_ref, currentEntry) {
      var n = _ref.n,
          i = _ref.index,
          entries = _ref.entries;
      var index = i - n; // reverse of n direction to get prev

      var entry = currentEntry || entries[index];
      if (!entry) return createPrevEmpty();
      var scene = this.routes[entry.type].scene || '';

      var action = _objectSpread({}, entry, {
        location: _objectSpread({}, entry.location, {
          index: index,
          scene: scene
        })
      });

      return createActionRef(action); // build the action for that entry, and create what the resulting state shape would have looked like
    }
  }, {
    key: "_findResetFirstAction",
    value: function _findResetFirstAction(entry) {
      var routes = this.routes,
          options = this.options; // the user can configure what the default first entry is

      if (options.resetFirstEntry) {
        return typeof options.resetFirstEntry === 'function' ? options.resetFirstEntry(entry) : options.resetFirstEntry;
      } // if not, we have little choice but to put a HOME or NOT_FOUND action at the front of the entries


      if (_typeof(entry) === 'object' && entry.type) {
        var action = entry;

        if (routes[action.type].path !== '/') {
          var homeType = Object.keys(routes).find(function (type) {
            return routes[type].path === '/';
          });
          return homeType ? {
            type: homeType
          } : {
            type: 'NOT_FOUND'
          };
        }

        return {
          type: 'NOT_FOUND'
        };
      } // entries may also be supplied as paths or arrays also containing state, eg:  [[path, state], [path, state]]


      var path = Array.isArray(entry) ? entry[0] : entry;
      var notFoundPath = routes.NOT_FOUND.path;

      if (path !== '/') {
        var homeRoute = Object.keys(routes).find(function (type) {
          return routes[type].path === '/';
        });
        return homeRoute ? '/' : notFoundPath;
      }

      return notFoundPath;
    }
  }, {
    key: "_once",
    value: function _once(commit) {
      var _this8 = this;

      var committed = false;
      return function (action) {
        if (committed) return Promise.resolve();
        committed = true;
        return Promise.resolve(commit(action)).then(function () {
          if (!_this8.options.save) return;

          _this8.options.save(_this8.location); // will retreive these from redux state, which ALWAYS updates first

        });
      };
    }
  }, {
    key: "_findAdjacentN",
    value: function _findAdjacentN(action) {
      return this._findBackN(action) || this._findNextN(action);
    }
  }, {
    key: "_findBackN",
    value: function _findBackN(action) {
      var e = this.entries[this.index - 1];
      return e && e.location.url === action.location.url && -1;
    }
  }, {
    key: "_findNextN",
    value: function _findNextN(action) {
      var e = this.entries[this.index + 1];
      return e && e.location.url === action.location.url && 1;
    }
  }, {
    key: "_pushToFront",
    value: function _pushToFront(action, prevEntries, index) {
      var entries = prevEntries.slice(0);
      var isBehindHead = entries.length > index;

      if (isBehindHead) {
        var entriesToDelete = entries.length - index;
        entries.splice(index, entriesToDelete, action);
      } else {
        entries.push(action);
      }

      return entries;
    }
  }, {
    key: "_resolveDelta",
    value: function _resolveDelta(delta, byIndex) {
      if (typeof delta === 'string') {
        var index = this.entries.findIndex(function (e) {
          return e.location.key === delta;
        });
        return index - this.index;
      }

      if (byIndex) {
        return delta - this.index;
      }

      return delta || 0;
    } // All child classes *should* implement this:

  }, {
    key: "_restore",
    value: function _restore() {
      return toEntries(this); // by default creates action array for a single entry: ['/']
    } // BrowseHistory (or 3rd party implementations) override these to provide sideFX

  }, {
    key: "_push",
    value: function _push() {}
  }, {
    key: "_replace",
    value: function _replace() {}
  }, {
    key: "_jump",
    value: function _jump() {}
  }, {
    key: "_set",
    value: function _set() {}
  }, {
    key: "_reset",
    value: function _reset() {}
  }, {
    key: "location",
    get: function get() {
      return this.getLocation();
    }
  }, {
    key: "entries",
    get: function get() {
      return this.location.entries;
    }
  }, {
    key: "index",
    get: function get() {
      return this.location.index;
    }
  }, {
    key: "url",
    get: function get() {
      return this.location.url;
    }
  }, {
    key: "n",
    get: function get() {
      return this.location.n;
    }
  }, {
    key: "prevUrl",
    get: function get() {
      return this.location.prev.location.url;
    }
  }]);

  return History;
}();

export { History as default };
//# sourceMappingURL=History.js.map