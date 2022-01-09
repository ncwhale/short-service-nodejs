const Koa = require("koa");
const KoaBody = require("koa-body");
const URL = require("url").URL;

// TODO: use config file.
const Storage = require("./storage/raw-file");
const storage = new Storage("./url-shortener.txt");

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

  let short_url = ctx.url.slice(1);
  // TODO: use config instead of magic number.
  if (short_url.length < 8) {
    short_url = null;
  }

  let short_url = await storage.create(origin_url.toString(), { short_url });
  ctx.body = ctx.origin + "/" + short_url;
}

async function GetShortURL(ctx) {
  let origin_url = await storage.get(ctx.url.slice(1));
  if (origin_url) {
    ctx.redirect(origin_url);
    ctx.body = origin_url;
  } else {
    ctx.status = 204;
  }
}

async function ModifyShortURL(ctx) {
  let short_url = ctx.url.slice(1);
  if (short_url.legnth < 1) {
    // silently ignore.
    ctx.status = 204;
    return;
  }

  // Check URL.
  let origin_url = ctx.request.body.url || ctx.header.url;
  origin_url = new URL(origin_url);

  let result = await storage.modify(short_url, origin_url.toString());

  ctx.body = "Modified";
}

async function DeleteShortURL(ctx) {
  let result = await storage.delete(ctx.url.slice(1));
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

app.listen(3000);
