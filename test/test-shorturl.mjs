import { expect, assert, should } from "chai";
import fetch from "node-fetch";
import config from "config";

import server from "../index.js";
const service_url = `http://localhost:${server.address().port}`;
console.log(service_url);

describe("Server", function () {
  it("Should startup and listen", function () {
    expect(server).to.exist;
    expect(server.listening).to.be.true;
  });

  describe("ShortURL service", function () {
    it("Should create a short url using POST", async function () {
      const origin_url =
        "https://post.test.org/abcdef?a=1&b=2&c=3#test-hash-tag";
      const result = await fetch(service_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: origin_url,
        }),
      });

      expect(result.status).to.equal(200);
      expect(result.headers.get("content-type")).includes("application/json");
      const json = await result.json();
      expect(json.short_url).to.exist;
      expect(json.origin_url).to.equal(origin_url);

      const result_get = await fetch(json.short_url, {
        method: "GET",
        redirect: "manual",
        follow: 0,
      });

      expect(result_get.status).to.be.within(300, 400);
      expect(result_get.headers.get("Location")).be.equal(origin_url);
      const result_get_json = await result_get.json();
      expect(result_get_json.origin_url).to.equal(origin_url);
    });

    it("Should allow predefined short URL",async function () {
      const predefined_url = "test-predefined-url";
      const origin_url = "https://predefined.test.org/A?a=1&b=2&c=3#-hash-tag";
      const timestamp = new Date().getTime();
      const result = await fetch(`${service_url}/${predefined_url}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-timestamp": timestamp,
          "x-signature": config.get("auth.options.presharedkey"),
        },
        body: JSON.stringify({
          url: origin_url,
        }),
      });

      expect(result.status).to.equal(200);
      expect(result.headers.get("content-type")).includes("application/json");
      const json = await result.json();
      expect(json.short_url).to.exist;
      expect(json.origin_url).to.equal(origin_url);

      const result_get = await fetch(json.short_url, {
        method: "GET",
        redirect: "manual",
        follow: 0,
      });

      expect(result_get.status).to.be.within(300, 400);
      expect(result_get.headers.get("Location")).be.equal(origin_url);
      const result_get_json = await result_get.json();
      expect(result_get_json.origin_url).to.equal(origin_url);
    });

    it("Should not service without auth", function () {});
  });

  describe("Admin service", function () {});
});
