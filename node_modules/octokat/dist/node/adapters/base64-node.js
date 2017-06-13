'use strict';

module.exports = function base64encode(str) {
  var buffer = new global['Buffer'](str, 'binary');
  return buffer.toString('base64');
};
//# sourceMappingURL=base64-node.js.map