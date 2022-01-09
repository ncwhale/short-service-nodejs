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

function CreateShortURL(ctx) {
  try {
    // URL param can from form data or http header.
    let origin_url = ctx.request.body.url || ctx.header.url;
    // Check URL.
    origin_url = new URL(origin_url);

    let short_url = storage.create(origin_url.toString());
    ctx.body = ctx.origin + "/" + short_url;
  } catch (e) {
    // TODO: handle error.
    console.error(e);
    // silently ignore.
    ctx.status = 204;
  }
}

function GetShortURL(ctx) {
  let origin_url = storage.get(ctx.url.slice(1));
  if (origin_url) {
    ctx.redirect(origin_url);
    ctx.body = origin_url;
  } else {
    ctx.status = 204;
  }
}

function ModifyShortURL(ctx) {
  ctx.body = "Modify url";
}

function DeleteShortURL(ctx) {
  ctx.body = "Deleted url";
}

const method = {
  GET: GetShortURL,
  PUT: CreateShortURL,
  POST: CreateShortURL,
  PATCH: ModifyShortURL,
  DELETE: DeleteShortURL,
};

app.use(async (ctx) => {
  if (ctx.method in method) {
    method[ctx.method](ctx);
  } else {
    ctx.status = 204;
  }
});

app.listen(3000);
