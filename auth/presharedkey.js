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

class PresharedKeyVerify {
  constructor(options) {
    this.presharedkey = options.presharedkey;
  }

  init(){
    // bind middleware to context
    this.check = this.check.bind(this);
    this.strict = this.strict.bind(this);
  }

  async check(ctx, next) {
    const signature = ctx.request.header["x-signature"] || ctx.query.signature;
    const payload = `${ctx.method} : ${ctx.params.short_url || ""} @ ${ctx.header['user-agent']}`;
    console.log(payload);
    console.log(signature);
    console.log(sign(payload, this.presharedkey));

    if (signature) {
      ctx.verified = verify(payload, signature, this.presharedkey);
    } else {
      ctx.verified = false;
    }

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