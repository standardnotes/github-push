'use strict';

var deprecate = require('./deprecate');
var OctokatBase = require('./base');

var HypermediaPlugin = require('./plugins/hypermedia');

var ALL_PLUGINS = [require('./plugins/object-chainer'), // re-chain methods when we detect an object (issue, comment, user, etc)
require('./plugins/path-validator'), require('./plugins/authorization'), require('./plugins/preview-apis'), require('./plugins/use-post-instead-of-patch'), require('./plugins/simple-verbs'), require('./plugins/fetch-all'), require('./plugins/pagination'),
// Run cacheHandler after PagedResults so the link headers are remembered
// but before hypermedia so the object is still serializable
require('./plugins/cache-handler'), require('./plugins/read-binary'), HypermediaPlugin, require('./plugins/camel-case')];

var Octokat = function Octokat() {
  var clientOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (clientOptions.plugins == null) {
    clientOptions.plugins = ALL_PLUGINS;
  }

  if (clientOptions.disableHypermedia) {
    deprecate('Please use the clientOptions.plugins array and just do not include the hypermedia plugin');
    clientOptions.plugins = clientOptions.plugins.filter(function (plugin) {
      return plugin !== HypermediaPlugin;
    });
  }

  // HACK to propagate the Fetch implementation
  if (Octokat.Fetch) {
    OctokatBase.Fetch = Octokat.Fetch;
  }
  // the octokat instance
  var instance = new OctokatBase(clientOptions);
  return instance;
};

// module.exports = Octokat;
module.exports = Octokat;
//# sourceMappingURL=octokat.js.map