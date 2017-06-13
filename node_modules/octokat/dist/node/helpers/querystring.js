'use strict';

// Converts a dictionary to a query string.
// Internal helper method
var toQueryString = function toQueryString(options, omitQuestionMark) {
  // Returns '' if `options` is empty so this string can always be appended to a URL
  if (!options || options === {}) {
    return '';
  }

  var params = [];
  var object = options || {};
  for (var key in object) {
    var value = object[key];
    if (value) {
      params.push(key + '=' + encodeURIComponent(value));
    }
  }
  if (params.length) {
    if (omitQuestionMark) {
      return '&' + params.join('&');
    } else {
      return '?' + params.join('&');
    }
  } else {
    return '';
  }
};

module.exports = toQueryString;
//# sourceMappingURL=querystring.js.map