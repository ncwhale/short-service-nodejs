class DummyVerify {
  constructor(config) {
    this.config = config || {};
    this.presharedkey = this.config.presharedkey || "test-pre-shared-key";
  }

  init() {
    // bind middleware to context
    this.check = this.check.bind(this);
    this.strict = this.strict.bind(this);
  }

  // Check if it is a valid call.
  async check(ctx, next) {
    if ("verified" in ctx) {
      return next();
    }

    const signature = ctx.request.headers["x-signature"] || ctx.query.signature;
    const timestamp = ctx.request.headers["x-timestamp"] || ctx.query.timestamp;

    // set ctx.verified flag.
    ctx.verified = signature === this.presharedkey && timestamp > 0;
    return next();
  }

  // It must be verified.
  async strict(ctx, next) {
    await this.check(ctx, () => {});
    if (ctx.verified) {
      await next();
    } else {
      return ctx.throw(401, "Unauthorized");
    }
  }
}

module.exports = DummyVerify;
