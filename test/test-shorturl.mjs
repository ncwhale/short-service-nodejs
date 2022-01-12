import { expect, assert } from "chai";
import fetch from "node-fetch";

import server from "../index.js";
const service_url = `http://localhost:${server.address().port}`;
console.log(service_url)

describe("Server", function () {
  it("Should startup and listen", function () {
    expect(server).to.exist;
    expect(server.listening).to.be.true;
  });
});