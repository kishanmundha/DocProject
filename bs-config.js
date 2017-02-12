// bs-config.js
"use strict";

var fallback = require('connect-history-api-fallback');
var log = require('connect-logger');

var virtualPath = '/docs';

/// Export configuration options
module.exports = {
  "port": 3000,
  "files": ["./src/**/*.{html,htm,css,js,md}"],
  //"server": { "baseDir": "./src" },
  "server": {
    "baseDir": "./src",
    "middleware": [
      log({ format: '%date %status %method %url' }),
      fallback({
        index: '/index.html',
        htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'] // systemjs workaround
      }),
      function (req, res, next) {
        if (virtualPath && req.url.indexOf(virtualPath) === 0) {
          req.url = req.url.substr(virtualPath.length);
        }
        next();
      }]
  },
  startPath: virtualPath
};