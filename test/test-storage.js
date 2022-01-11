const assert = require("assert");
const config = require("config");
const Storage = require("../storage/" + config.get("storage.module"));

describe("Storage", function () {
  describe("test config", function () {
    var storage = null;

    beforeEach(async function () {
      storage = new Storage(config.get("storage.options"));
      // Initialize storage.
      await storage.init();
    });

    it("should impl interface", function () {
      assert.ok(storage);
      assert.ok(storage.init instanceof Function);
      assert.ok(storage.create instanceof Function);
      assert.ok(storage.get instanceof Function);
      assert.ok(storage.modify instanceof Function);
      assert.ok(storage.delete instanceof Function);
    });

    it("should CRUD works", async function () {
      const predefined_short_url = "test-short-url";
      const predefined_origin_url =
        "https://predefine.test.org/abcdsafef?a=1&b=2&c=3#test-hash-tag";

      const result_predefine = await storage.create(predefined_origin_url, {
        short_url: predefined_short_url,
      });

      const random_origin_url =
        "https://new.test.org/abcdef?a=1&b=2&c=3#test-hash-tag";

      const result_random = await storage.create(random_origin_url);

      assert.equal(result_predefine.short_url, predefined_short_url);
      assert.equal(result_predefine.origin_url, predefined_origin_url);

      assert.equal(
        await storage.get(predefined_short_url),
        predefined_origin_url
      );
      assert.equal(
        await storage.get(result_random.short_url),
        random_origin_url
      );
      assert.equal(await storage.get("should-not-be-matched"), undefined);

      const modified_origin_url = "https://modify.test.org/abcdef?a=1&b=2&c=3#";
      assert.equal(
        await storage.modify(predefined_short_url, modified_origin_url),
        true
      );
      assert.equal(
        await storage.get(predefined_short_url),
        modified_origin_url
      );

      assert.equal(await storage.delete(result_random.short_url), true);
      assert.equal(await storage.get(result_random.short_url), undefined);
    });
  });
});
