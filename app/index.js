"use strict";

const Koa = require("koa");
const config = require("config");

const app = new Koa();

const shortURLrouter = require("./shorturl");

app
  .use(shortURLrouter.routes())
  .use(shortURLrouter.allowedMethods());

if (config.get("admin.enabled")) {
  const adminRouter = require("./admin");
  app.use(adminRouter.routes());
}

module.exports = app;