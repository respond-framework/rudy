export default (function (action) {
  return !!(action && action.location && (action.location.kind === 'replace' || action.location.from));
}); // sometimes the kind will be back/next when automatic back/next detection is in play
//# sourceMappingURL=isRedirect.js.map