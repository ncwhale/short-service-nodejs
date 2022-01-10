class DummyVerify {
  constructor(config) {
  }

  init(){}

  // Check if it is a valid call.
  check(ctx, next) {
    // set ctx.verified flag.
    ctx.verified = true;
    return next();
  }

  // It must be verified.
  strict(ctx, next) {
    ctx.verified = true;
    return next();
  }
}

module.exports = DummyVerify;