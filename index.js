const Koa = require("koa");
const KoaBody = require("koa-body");

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

app.use(async (ctx) => {
  // TODO: use route or object.
  switch (ctx.method) {
    case "GET":
      {
        let origin_url = storage.get(ctx.url.slice(1));
        if (origin_url) {
          ctx.redirect(origin_url);
          ctx.body = origin_url;
        } else {
          ctx.status = 204;
        }
      }
      break;
    case "POST":
    case "PUT":
      {
        // Use POST/PUT to create a shorten URL.
        let origin_url = ctx.request.body.url || ctx.header.url;
        let short_url = storage.create(origin_url);
        ctx.body = ctx.origin + "/" + short_url;
      }
      break;
    case "PATCH":
      // Use PATCH to modify a shorten URL.
      break;
    case "DELETE":
      // Use DELETE to delete a shorten URL.
      {
        ctx.body = "Delete url";
      }
      break;
    default:
      ctx.redirect("https://google.com");
      break;
  }
});

app.listen(3000);
