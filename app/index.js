"use strict";

const Koa = require("koa");

const app = new Koa();

const shortURLrouter = require("./shorturl");

app
  .use(shortURLrouter.routes())
  .use(shortURLrouter.allowedMethods());

module.exports = app;