"use strict";

const crypto = require("crypto");

function sign(payoad, presharedkey) {
  const sign = crypto.createHmac("sha256", presharedkey);
  sign.update(payoad);
  return sign.digest("base64url");
}

function verify(payload, signature, presharedkey) {
  return sign(payload, presharedkey) === signature;
}

function verifyTimestamp(timestamp, timestamp_error_limit) {
  const now = new Date().getTime();
  const diff = Math.abs(now - parseFloat(timestamp));
  return diff < timestamp_error_limit;
}

class PresharedKeyVerify {
  constructor(options) {
    this.presharedkey = options.presharedkey || crypto.randomBytes(32).toString("base64url");
    this.timestamp_error_limit = options.timestamp_error_limit || 1000 * 60 * 5; // 5 minutes
  }

  init(){
    // bind middleware to context
    this.check = this.check.bind(this);
    this.strict = this.strict.bind(this);
  }

  async check(ctx, next) {
    // Skip multiple verification
    if ("verified" in ctx) {
      return next();
    }

    const signature = ctx.request.header["x-signature"] || ctx.query.signature;
    const timestamp = ctx.request.header["x-timestamp"] || ctx.query.timestamp;

    if (!signature || !timestamp || !verifyTimestamp(timestamp, this.timestamp_error_limit)) {
      ctx.verified = false;
      return next();
    }

    const payload = `${ctx.method} ${ctx.params.short_url || ""}\n${ctx.header['user-agent']}\n${ctx.ip}\n${timestamp}`;
    console.dir({ payload, signature, presharedkey: this.presharedkey, sign: sign(payload, this.presharedkey) });
    ctx.verified = verify(payload, signature, this.presharedkey);

    return next();
  };

  async strict(ctx, next) {
    await this.check(ctx, () => { });
    if (ctx.verified) {
      await next();
    } else {
      return ctx.throw(401, "Unauthorized");
    }
  }
}

module.exports = PresharedKeyVerify;