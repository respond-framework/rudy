"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NavLink = exports.Link = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _rudy = require("@respond-framework/rudy");

var _utils = require("./utils");

var _provider = require("./provider");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var LinkInner = function LinkInner(props) {
  var to = props.to,
      redirect = props.redirect,
      _props$component = props.component,
      Component = _props$component === void 0 ? 'a' : _props$component,
      children = props.children,
      onPress = props.onPress,
      onClick = props.onClick,
      _props$down = props.down,
      down = _props$down === void 0 ? false : _props$down,
      _props$shouldDispatch = props.shouldDispatch,
      shouldDispatch = _props$shouldDispatch === void 0 ? true : _props$shouldDispatch,
      target = props.target,
      dispatch = props.dispatch,
      bn = props.basename,
      cp = props.currentPathname,
      api = props.api,
      routesAdded = props.routesAdded,
      u = props.url,
      isActive = props.isActive,
      partial = props.partial,
      strict = props.strict,
      query = props.query,
      hash = props.hash,
      activeStyle = props.activeStyle,
      activeClassName = props.activeClassName,
      ariaCurrent = props.ariaCurrent,
      p = _objectWithoutProperties(props, ["to", "redirect", "component", "children", "onPress", "onClick", "down", "shouldDispatch", "target", "dispatch", "basename", "currentPathname", "api", "routesAdded", "url", "isActive", "partial", "strict", "query", "hash", "activeStyle", "activeClassName", "ariaCurrent"]);

  var routes = api.routes,
      getLocation = api.getLocation,
      options = api.options,
      history = api.history;
  var curr = cp || getLocation().pathname; // for relative paths and incorrect actions (incorrect actions don't waste re-renderings and just get current pathname from context)

  var _toUrlAndAction = (0, _utils.toUrlAndAction)(to, routes, bn, curr, options),
      fullUrl = _toUrlAndAction.fullUrl,
      action = _toUrlAndAction.action;

  var hasHref = Component === 'a' || typeof Component !== 'string';

  var handler = _utils.handlePress.bind(null, action, api.routes, shouldDispatch, dispatch, onPress || onClick, target, redirect, fullUrl, history);

  return _react.default.createElement(Component, _extends({
    onClick: !down && handler || _utils.preventDefault,
    href: hasHref ? fullUrl : undefined,
    onMouseDown: down ? handler : undefined,
    onTouchStart: down ? handler : undefined,
    target: target
  }, p, navLinkProps(props, fullUrl, action)), children);
};

var navLinkProps = function navLinkProps(props, toFullUrl, action) {
  if (!props.url) return undefined;
  var url = props.url,
      isActive = props.isActive,
      partial = props.partial,
      strict = props.strict,
      q = props.query,
      h = props.hash,
      style = props.style,
      className = props.className,
      activeStyle = props.activeStyle,
      _props$activeClassNam = props.activeClassName,
      activeClassName = _props$activeClassNam === void 0 ? '' : _props$activeClassNam,
      _props$ariaCurrent = props.ariaCurrent,
      ariaCurrent = _props$ariaCurrent === void 0 ? 'true' : _props$ariaCurrent,
      api = props.api;
  var getLocation = api.getLocation,
      options = api.options,
      routes = api.routes;

  var _urlToLocation = (0, _rudy.urlToLocation)(toFullUrl),
      pathname = _urlToLocation.pathname,
      query = _urlToLocation.query,
      hash = _urlToLocation.hash;

  var matchers = {
    path: pathname,
    query: q && query,
    hash: h && hash
  };
  var opts = {
    partial: partial,
    strict: strict
  };
  var route = routes[action.type] || {};
  var match = (0, _rudy.matchUrl)(url, matchers, opts, route, options);

  if (match) {
    Object.assign(match, action);
  }

  var active = !!(isActive ? isActive(match, getLocation()) : match);
  return {
    style: active ? _objectSpread({}, style, activeStyle) : style,
    className: "".concat(className || '', " ").concat(active ? activeClassName : '').trim(),
    'aria-current': active && ariaCurrent
  };
};

var mapState = function mapState(state, _ref) {
  var api = _ref.api,
      props = _objectWithoutProperties(_ref, ["api"]);

  var _api$getLocation = api.getLocation(),
      url = _api$getLocation.url,
      pathname = _api$getLocation.pathname,
      bn = _api$getLocation.basename,
      routesAdded = _api$getLocation.routesAdded;

  var isNav = props.activeClassName || props.activeStyle; // only NavLinks re-render when the URL changes
  // We are very precise about what we want to cause re-renderings, as perf is
  // important! So only pass currentPathname if the user will in fact be making
  // use of it for relative paths.

  var currentPathname;

  if (typeof props.to === 'string' && props.to.charAt(0) !== '/') {
    currentPathname = pathname;
  }

  var basename = bn ? "/".concat(bn) : '';
  return {
    api: api,
    basename: basename,
    routesAdded: routesAdded,
    url: isNav && url,
    currentPathname: currentPathname
  };
};

var connector = (0, _reactRedux.connect)(mapState);
var LinkConnected = connector(LinkInner);

var Link = function Link(props) {
  return _react.default.createElement(_provider.RudyConsumer, null, function (api) {
    return _react.default.createElement(LinkConnected, _extends({
      api: api
    }, props));
  });
};

exports.Link = Link;

var NavLink = function NavLink(_ref2) {
  var _ref2$activeClassName = _ref2.activeClassName,
      activeClassName = _ref2$activeClassName === void 0 ? 'active' : _ref2$activeClassName,
      props = _objectWithoutProperties(_ref2, ["activeClassName"]);

  return _react.default.createElement(Link, _extends({
    activeClassName: activeClassName
  }, props));
};

exports.NavLink = NavLink;
//# sourceMappingURL=link.js.map