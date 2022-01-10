const path = require('path');

module.exports = {
  storage: {
    // For test purpose, we use raw-file storage.
    module: "raw-file",
    options: {
      filePath: path.join(__dirname, "../test/data/test-raw-file.txt"),
    },
  },
  auth: {
    presharedkey: "salted-test-pre-shared-key",
  },
  service: {
    port: 53030,
    host: "localhost",
  }
}