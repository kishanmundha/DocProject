// bs-config.js
"use strict";

/// Export configuration options
module.exports = {
  "port": 3000,
  "files": ["./publish/**/*.{html,htm,css,js,md}"],
  "server": { "baseDir": "./publish" }
};