"use strict";

const config = require("config");
const app = require("./app");

app.proxy = config.get("service.proxy");

// For development debugging.
if(config.util.getEnv("NODE_ENV") === "development") {
  console.dir(config);
}

let server = null;
if (config.has("service.host")) {
  server = app.listen(config.get("service.port"), config.get("service.host"));
} else {
  server = app.listen(config.get("service.port"));
}

module.exports = server;