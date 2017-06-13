"use strict";

module.exports = function (message) {
  if (console && console.warn) {
    console.warn("Octokat Deprecation: " + message);
  }
};
//# sourceMappingURL=deprecate.js.map