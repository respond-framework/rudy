export default (function (a) {
  return a && (a.type || // History uses actions with undefined states
  a.hasOwnProperty('state') || // eslint-disable-line no-prototype-builtins
  a.params || a.query || a.hash !== undefined || a.basename !== undefined || a.payload || a.meta);
});
//# sourceMappingURL=isAction.js.map