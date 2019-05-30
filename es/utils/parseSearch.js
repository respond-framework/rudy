import qs from 'qs';
export default (function (search) {
  return qs.parse(search, {
    decoder: decoder
  });
});

var decoder = function decoder(str, decode) {
  return isNumber(str) ? Number.parseFloat(str) : decode(str);
};

var isNumber = function isNumber(str) {
  return !Number.isNaN(Number.parseFloat(str));
};
//# sourceMappingURL=parseSearch.js.map