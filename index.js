"use strict";

const config = require("config");
const app = require("./app");

if (config.has("service.host")) {
  app.listen(config.get("service.port"), config.get("service.host"));
} else {
  app.listen(config.get("service.port"));
}
