module.exports = {
  storage: {
    module: "raw-file",
    options: {},
  },
  short_url: {
    // strict when create predefined short URL.
    // if true, only verifed user can create predefined short URL.
    predefined_url_strict: false,

    // predefined short URL size limit.
    predefined_min_size: 8,
    predefined_max_size: 128,

    // random short URL size limit.
    random_size: 8,

    // create/modify/delete rate limit.
    operation_rate_limit: {
      duration: 60000, // 1 min
      max: 10,
    }
  },
  auth: {
    module: "dummy",
    options: {}
  },
  admin: {
    enabled: false,
  },
  service: {
    // enable x-forwarded-* header.
    proxy: true,
    port: 3000,
    host: "localhost",
  }
}