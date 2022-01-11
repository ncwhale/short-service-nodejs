"use strict";

const config = require("config");
const app = require("./app");

// For development debugging.
if(config.util.getEnv("NODE_ENV") === "development") {
  console.dir(config);
}

if (config.has("service.host")) {
  app.listen(config.get("service.port"), config.get("service.host"));
} else {
  app.listen(config.get("service.port"));
}
