"use strict";

const config = require("config");
const Koa = require("koa");
const KoaBody = require("koa-body");
const KoaRouter = require("@koa/router");
const URL = require("url").URL;

const storage = require("../storage");
const app = new Koa();
app.use(
  KoaBody({
    multipart: false,
    urlencoded: true,
    json: true,
    text: true,
    encoding: "utf8",
    parsedMethods: ["POST", "PUT", "PATCH"],
  })
);
async function CreateShortURL(ctx) {
  // URL param can from form data or http header.
  let origin_url = ctx.request.body.url || ctx.header.url;
  // Check URL.
  origin_url = new URL(origin_url);

  let short_url = ctx.short_url;
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
  let origin_url = await storage.get(ctx.short_url);
  if (origin_url) {
    ctx.redirect(origin_url);
    ctx.body = { origin_url };
  } else {
    ctx.status = 204;
  }
}

async function ModifyShortURL(ctx) {
  if (ctx.short_url.legnth < 1) {
    // silently ignore.
    ctx.status = 204;
    return;
  }

  // Check URL.
  let origin_url = ctx.request.body.url || ctx.header.url;
  origin_url = new URL(origin_url);

  let result = await storage.modify(ctx.short_url, origin_url.toString());

  ctx.body = "Modified";
}

async function DeleteShortURL(ctx) {
  let result = await storage.delete(ctx.short_url);
  ctx.body = "Deleted";
}

const method = {
  GET: GetShortURL,
  PUT: CreateShortURL,
  POST: CreateShortURL,
  PATCH: ModifyShortURL,
  DELETE: DeleteShortURL,
};

app.use(async (ctx) => {
  if (ctx.method in method)
    try {
      // Every method need this param.
      ctx.short_url = ctx.url.slice(1);
      await method[ctx.method](ctx);
    } catch (e) {
      // TODO: handle error.
      console.error(e);
      // silently ignore.
      ctx.status = 204;
    }
  else {
    ctx.status = 204;
  }
});

module.exports = app;