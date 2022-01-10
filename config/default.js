module.exports = {
  storage: {
    module: "raw-file",
    options: {},
  },
  short_url: {
    // predefined short URL size limit.
    predefined_min_size: 8,
    predefined_max_size: 128,
    random_size: 8,
  },
  auth: {
    // auth module.
    presharedkey: null,
  },
  service: {
    port: 3000,
    host: "localhost",
  }
}