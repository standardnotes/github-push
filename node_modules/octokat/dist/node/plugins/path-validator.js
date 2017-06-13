'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URL_VALIDATOR = require('../grammar/url-validator');

module.exports = new (function () {
  function PathValidator() {
    _classCallCheck(this, PathValidator);
  }

  _createClass(PathValidator, [{
    key: 'requestMiddlewareAsync',
    value: function requestMiddlewareAsync(input) {
      var path = input.path;

      if (!URL_VALIDATOR.test(path)) {
        var err = 'Octokat BUG: Invalid Path. If this is actually a valid path then please update the URL_VALIDATOR. path=' + path;
        console.warn(err);
      }
      return Promise.resolve(input);
    }
  }]);

  return PathValidator;
}())();
//# sourceMappingURL=path-validator.js.map