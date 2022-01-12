process.env["NODE_ENV"] = "test";
process.env["NODE_CONFIG_ENV"] = "test";

module.exports = {
  require: ["./test.env.mjs"],
};
