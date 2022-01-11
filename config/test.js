const path = require('path');

module.exports = {
  storage: {
    // For test purpose, we use raw-file storage.
    module: "raw-file",
    options: {
      filePath: path.join(__dirname, "../test/data/test-raw-file.txt"),
    },
  },
  short_url: {
    predefined_url_strict: true,
    predefined_min_size: 1,
    predefined_max_size: 128,
    random_size: 8,

    operation_rate_limit: {
      duration: 1000, // 1 sec
      max: 1000000, // 1,000,000
    },
  },
  auth: {
    module: "presharedkey",
    options: {
      presharedkey: "salted-test-pre-shared-key",
    }
  },
  admin: {
    enabled: true,
  },
  service: {
    proxy: true,
    port: 53030,
    host: "localhost",
  }
}