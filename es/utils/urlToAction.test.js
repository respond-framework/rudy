function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import urlToAction, { defaultFromPath } from './urlToAction';
describe('Parses params', function () {
  var _routes;

  var NOT_FOUND = 'NOT_FOUND';
  var ROOT = 'ROOT';
  var STATIC = 'STATIC';
  var UNNAMED_PARAM = 'UNNAMED_PARAM';
  var SINGLE_PARAM = 'SINGLE_PARAM';
  var OPTIONAL_PARAM = 'OPTIONAL_PARAM';
  var MULTIPLE_PARAMS = 'MULTIPLE_PARAMS';
  var OPTIONAL_PATH_PARAM = 'OPTIONAL_PATH_PARAM';
  var COMPULSORY_PATH_PARAM = 'COMPULSORY_PATH_PARAM';
  var MULTI_MULTI_PARAM = 'MULTI_MULTI_PARAM';
  var routes = (_routes = {}, _defineProperty(_routes, NOT_FOUND, {
    path: '/404'
  }), _defineProperty(_routes, ROOT, {
    path: '/'
  }), _defineProperty(_routes, STATIC, {
    path: '/static'
  }), _defineProperty(_routes, UNNAMED_PARAM, {
    path: '/unnamed(.*)'
  }), _defineProperty(_routes, SINGLE_PARAM, {
    path: '/compulsory/:param'
  }), _defineProperty(_routes, OPTIONAL_PARAM, {
    path: '/optional/:param?'
  }), _defineProperty(_routes, MULTIPLE_PARAMS, {
    path: '/multiple/:p1/:p2'
  }), _defineProperty(_routes, OPTIONAL_PATH_PARAM, {
    path: '/multistar/:p*'
  }), _defineProperty(_routes, COMPULSORY_PATH_PARAM, {
    path: '/multiplus/:p+'
  }), _defineProperty(_routes, MULTI_MULTI_PARAM, {
    path: '/multimulti/:p1*/separator/:p2+'
  }), _routes);
  var api = {
    routes: routes,
    options: {}
  };

  var assertActionForUrl = function assertActionForUrl(url, action) {
    return expect(urlToAction(api, url, {})).toEqual(_objectSpread({
      basename: '',
      hash: '',
      location: {
        key: '345678',
        pathname: url,
        scene: '',
        search: '',
        url: url
      },
      query: {},
      state: {},
      params: {}
    }, action));
  };

  it('Static path', function () {
    assertActionForUrl('/', {
      type: ROOT
    });
    assertActionForUrl('/static', {
      type: STATIC
    });
  });
  it('Single unnamed parameter', function () {
    assertActionForUrl('/unnamed', {
      type: UNNAMED_PARAM,
      params: {
        '0': ''
      }
    });
    assertActionForUrl('/unnamedapple', {
      type: UNNAMED_PARAM,
      params: {
        '0': 'apple'
      }
    });
  });
  it('Single compulsory parameter', function () {
    assertActionForUrl('/compulsory', {
      type: NOT_FOUND
    });
    assertActionForUrl('/compulsory/apple', {
      type: SINGLE_PARAM,
      params: {
        param: 'apple'
      }
    });
  });
  it('Single optional parameter', function () {
    assertActionForUrl('/optional', {
      type: OPTIONAL_PARAM
    });
    assertActionForUrl('/optional/test', {
      type: OPTIONAL_PARAM,
      params: {
        param: 'test'
      }
    });
  });
  it('Multiple parameters', function () {
    assertActionForUrl('/multiple/1/2', {
      type: MULTIPLE_PARAMS,
      params: {
        p1: '1',
        p2: '2'
      }
    });
  });
  it('Multi segment optional parameter', function () {
    assertActionForUrl('/multistar', {
      type: OPTIONAL_PATH_PARAM
    });
    assertActionForUrl('/multistar/single', {
      type: OPTIONAL_PATH_PARAM,
      params: {
        p: 'single'
      }
    });
    assertActionForUrl('/multistar/one/two/three', {
      type: OPTIONAL_PATH_PARAM,
      params: {
        p: 'one/two/three'
      }
    });
  });
  it('Multi segment compulsory parameter', function () {
    assertActionForUrl('/multiplus', {
      type: NOT_FOUND
    });
    assertActionForUrl('/multiplus/one', {
      type: COMPULSORY_PATH_PARAM,
      params: {
        p: 'one'
      }
    });
    assertActionForUrl('/multiplus/one/two', {
      type: COMPULSORY_PATH_PARAM,
      params: {
        p: 'one/two'
      }
    });
  });
  it('Multiple multi segment params', function () {
    assertActionForUrl('/multimulti/separator/one', {
      type: MULTI_MULTI_PARAM,
      params: {
        p2: 'one'
      }
    });
    assertActionForUrl('/multimulti/separator/one/two', {
      type: MULTI_MULTI_PARAM,
      params: {
        p2: 'one/two'
      }
    });
    assertActionForUrl('/multimulti/one/two/separator/three/four', {
      type: MULTI_MULTI_PARAM,
      params: {
        p1: 'one/two',
        p2: 'three/four'
      }
    });
  });
});
describe('defaultFromPath', function () {
  var checkFromPath = function checkFromPath(value, result) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        repeat = _ref.repeat,
        optional = _ref.optional,
        convertNumbers = _ref.convertNumbers,
        capitalizedWords = _ref.capitalizedWords;

    var label;

    if (value === undefined) {
      label = 'undefined';
    } else if (Array.isArray(value)) {
      label = '[Array]';
    } else if (typeof value === 'string') {
      label = "'".concat(value, "'");
    }

    var repeatValues = [true, false].filter(function (val) {
      return !val !== repeat;
    });
    var optionalValues = [true, false].filter(function (val) {
      return !val !== optional;
    });
    var convertNumbersValues = [true, false].filter(function (val) {
      return !val !== convertNumbers;
    });
    var capitalizeWordsValues = [true, false].filter(function (val) {
      return !val !== capitalizedWords;
    });
    repeatValues.forEach(function (r) {
      optionalValues.forEach(function (o) {
        capitalizeWordsValues.forEach(function (w) {
          convertNumbersValues.forEach(function (n) {
            return it("defaultFromPath(".concat(label, ", { name: 'test', repeat: ").concat(repeat ? 'true' : 'false', ", optional: ").concat(optional ? 'true' : 'false', "}, { convertNumbers: ").concat(n ? 'true' : 'false', ", capitalizedWords: ").concat(w ? 'true' : 'false', " })"), function () {
              return expect(defaultFromPath(value, {
                name: 'test',
                optional: o,
                repeat: r
              }, {
                convertNumbers: n,
                capitalizedWords: w
              }, {})).toEqual(result);
            });
          });
        });
      });
    });
  }; // absent optional  params


  checkFromPath(undefined, undefined, {
    optional: true,
    repeat: false
  });
  checkFromPath([], undefined, {
    repeat: true,
    optional: true
  }); // strings

  checkFromPath('one%20two-three', 'one%20two-three', {
    repeat: false,
    capitalizedWords: false
  });
  checkFromPath('42', '42', {
    repeat: false,
    convertNumbers: false
  }); // convertNumbers

  checkFromPath('42', 42, {
    repeat: false,
    convertNumbers: true
  });
  checkFromPath('3.141', 3.141, {
    repeat: false,
    convertNumbers: true
  }); // capitalizedWords

  checkFromPath('one-two-three', 'One Two Three', {
    repeat: false,
    capitalizedWords: true
  });
  checkFromPath('one', 'One', {
    repeat: false,
    capitalizedWords: true
  }); // multiple segments

  checkFromPath(['segment1'], 'segment1', {
    repeat: true
  });
  checkFromPath(['segment1', 'segment%202', 'segment-three', '42'], 'segment1/segment%202/segment-three/42', {
    repeat: true
  });
});
//# sourceMappingURL=urlToAction.test.js.map