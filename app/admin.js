"use strict";

const KoaRouter = require("@koa/router");

const storage = require("../storage");
const auth = require("../auth");

const router = new KoaRouter({
  prefix: "/admin",
});

module.exports = router;
