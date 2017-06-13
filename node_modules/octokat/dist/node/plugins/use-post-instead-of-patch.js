'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = new (function () {
  function UsePostInsteadOfPatch() {
    _classCallCheck(this, UsePostInsteadOfPatch);
  }

  _createClass(UsePostInsteadOfPatch, [{
    key: 'requestMiddlewareAsync',
    value: function requestMiddlewareAsync(input, cb) {
      var usePostInsteadOfPatch = input.clientOptions.usePostInsteadOfPatch,
          method = input.method;

      if (usePostInsteadOfPatch && method === 'PATCH') {
        input.method = 'POST';
      }
      return Promise.resolve(input);
    }
  }]);

  return UsePostInsteadOfPatch;
}())();
//# sourceMappingURL=use-post-instead-of-patch.js.map