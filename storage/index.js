const config = require("config");
const Storage = require("./" + config.get("storage.module"));
const storage = new Storage(config.get("storage.options"));

(async () => {
  // Initialize storage.
  await storage.init();
})();

module.exports = storage;