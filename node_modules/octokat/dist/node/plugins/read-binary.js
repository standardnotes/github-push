'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var toQueryString = require('../helpers/querystring');

module.exports = new (function () {
  function ReadBinary() {
    _classCallCheck(this, ReadBinary);

    this.verbs = {
      readBinary: function readBinary(path, query) {
        return { method: 'GET', path: '' + path + toQueryString(query), options: { isRaw: true, isBase64: true } };
      }
    };
  }

  _createClass(ReadBinary, [{
    key: 'requestMiddlewareAsync',
    value: function requestMiddlewareAsync(input) {
      var options = input.options;

      if (options) {
        var isBase64 = options.isBase64;

        if (isBase64) {
          input.headers['Accept'] = 'application/vnd.github.raw';
          input.mimeType = 'text/plain; charset=x-user-defined';
        }
      }
      return Promise.resolve(input);
    }
  }, {
    key: 'responseMiddlewareAsync',
    value: function responseMiddlewareAsync(input) {
      var options = input.options,
          data = input.data;

      if (options) {
        var isBase64 = options.isBase64;
        // Convert the response to a Base64 encoded string

        if (isBase64) {
          // Convert raw data to binary chopping off the higher-order bytes in each char.
          // Useful for Base64 encoding.
          var converted = '';
          var iterable = __range__(0, data.length, false);
          for (var j = 0; j < iterable.length; j++) {
            var i = iterable[j];
            converted += String.fromCharCode(data.charCodeAt(i) & 0xff);
          }

          input.data = converted; // or throw new Error('BUG! Expected JSON data to exist')
        }
      }
      return Promise.resolve(input);
    }
  }]);

  return ReadBinary;
}())();

function __range__(left, right, inclusive) {
  var range = [];
  var ascending = left < right;
  var end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}
//# sourceMappingURL=read-binary.js.map