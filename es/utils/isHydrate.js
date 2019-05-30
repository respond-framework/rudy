import { isServer } from '@respond-framework/utils';
export default (function (req) {
  var _req$getLocation = req.getLocation(),
      universal = _req$getLocation.universal;

  return universal && !isServer() && req.getKind() === 'load';
});
//# sourceMappingURL=isHydrate.js.map