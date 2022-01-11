"use strict";

const config = require("config");
const KoaBody = require("koa-body");
const KoaRouter = require("@koa/router");
const URL = require("url").URL;

const storage = require("../storage");
const auth = require("../auth");

const router = new KoaRouter();
const bodyParser = KoaBody({
  multipart: false,
  urlencoded: true,
  json: true,
  text: true,
  encoding: "utf8",
  parsedMethods: ["POST", "PUT", "PATCH"],
});

async function CreateShortURL(ctx) {
  // URL param can from form data or http header.
  let origin_url = ctx.request.body.url || ctx.header.url;
  // Check URL.
  origin_url = new URL(origin_url);

  let short_url = ctx.params.short_url || "";
  if (
    short_url.length < config.get("short_url.predefined_min_size") ||
    short_url.length > config.get("short_url.predefined_max_size")
  ) {
    short_url = null;
  }
  let short_url_size = config.get("short_url.random_size");

  let result = await storage.create(origin_url.toString(), {
    short_url,
    short_url_size,
  });
  ctx.body = {
    ...result,
    short_url: ctx.origin + "/" + result.short_url,
  };
}

async function GetShortURL(ctx) {
  let origin_url = await storage.get(ctx.params.short_url);
  if (origin_url) {
    ctx.redirect(origin_url);
    ctx.body = { origin_url };
  } else {
    ctx.status = 204;
  }
}

async function ModifyShortURL(ctx) {
  // Check URL.
  let origin_url = ctx.request.body.url || ctx.header.url;
  origin_url = new URL(origin_url);

  let result = await storage.modify(ctx.params.short_url, origin_url.toString());

  ctx.body = "Modified";
}

async function DeleteShortURL(ctx) {
  let result = await storage.delete(ctx.params.short_url);
  ctx.body = "Deleted";
}

// Error handler.
router.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    // TODO: handle error.
    console.error(e);
    // silently ignore.
    ctx.status = 204;
  }
});

router.get("/:short_url", GetShortURL);
router.post("/", auth.check, bodyParser, CreateShortURL);
router.put("/:short_url", auth.check, bodyParser, CreateShortURL);
router.patch("/:short_url", auth.strict, bodyParser, ModifyShortURL);
router.delete("/:short_url", auth.strict, DeleteShortURL);

module.exports = router;