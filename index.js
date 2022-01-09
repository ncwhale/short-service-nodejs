const Koa = require("koa");
const app = new Koa();

app.use(async (ctx) => {
  console.log(ctx.method);
  switch (ctx.method) {
    case "GET":
      ctx.body = "Hello World";
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
