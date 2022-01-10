"use strict";

const config = require('config');
const AuthModule = require('./' + config.get('auth.module'));
const verifyMiddleware = new AuthModule(config.get('auth.options'));

(async () => {
  await verifyMiddleware.init();
})();

module.exports = verifyMiddleware;