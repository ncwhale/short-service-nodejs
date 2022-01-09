const Koa = require("koa");
const app = new Koa();
// TODO: use config file.
const Storage = require("./storage/raw-file");
const storage = new Storage("./url-shortener.txt");

app.use(async (ctx) => {
  console.log(ctx.method);
  console.log(ctx.url);

  // TODO: use route or object.
  switch (ctx.method) {
    case "GET":
      let origin_url = storage.get(ctx.url.slice(1));
      if (origin_url) {
        ctx.redirect(origin_url);
        ctx.body = origin_url;
      } else {
        ctx.status = 204;
      }
      break;
    case "POST":
    case "PUT":
      // Use POST/PUT to create a shorten URL.
      ctx.body = "Add new url for shortening";
      break;
    case "DELETE":
      // Use DELETE to delete a shorten URL.
      ctx.body = "Delete url";
      break;
    default:
      ctx.redirect("https://google.com");
      break;
  }
});

app.listen(3000);
