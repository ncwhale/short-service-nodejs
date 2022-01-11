const path = require("path");
const assert = require("assert");
const RAWfile = require("../storage/raw-file");

describe("Storage", function () {
  describe("Raw File", function () {
    it("should impl interface", function () {
      assert.ok(RAWfile);

      const storage = new RAWfile();

      assert.ok(storage);
      assert.ok(storage.init instanceof Function);
      assert.ok(storage.create instanceof Function);
      assert.ok(storage.get instanceof Function);
      assert.ok(storage.modify instanceof Function);
      assert.ok(storage.delete instanceof Function);
    });

    it("should load test url from file after init and ignore last odd line", async () => {
      const storage = new RAWfile({
        filePath: path.join(__dirname, "data", "test-raw-file.txt"),
      });

      assert.notEqual(
        storage.get("aabbcc"),
        "https://test.org/abcdef?a=1&b=2&c=3#test-hash-tag"
      );

      await storage.init();

      assert.equal(
        storage.get("aabbcc"),
        "https://test.org/abcdef?a=1&b=2&c=3#test-hash-tag"
      );
      assert.equal(storage.get("should-not-be-matched"), undefined);
    });

    it("should create&get new url", function () {
      const storage = new RAWfile();

      const result = storage.create(
        "https://test.org/abcdef?a=1&b=2&c=3#test-hash-tag",
        {
          short_url: "test-short-url",
        }
      );

      const result_new = storage.create(
        "https://new.test.org/abcdef?a=1&b=2&c=3#test-hash-tag"
      );
      
      assert.equal(result.short_url, "test-short-url");
      assert.equal(
        result.origin_url,
        "https://test.org/abcdef?a=1&b=2&c=3#test-hash-tag"
      );

      assert.equal(
        storage.get("test-short-url"),
        "https://test.org/abcdef?a=1&b=2&c=3#test-hash-tag"
      );

      assert.equal(storage.get(result_new.short_url), result_new.origin_url);
    });

    it("should not create duplicated url", function () {
      const storage = new RAWfile();

      const result = storage.create(
        "https://test.org/abcdef?a=1&b=2&c=3#test-hash-tag",
        {
          short_url: "test-short-url-duplicated",
        }
      );
      const result_duplicate = storage.create(
        "https://test.org/abcdef?a=1&b=2&c=3#test-hash-tag",
        {
          short_url: "test-short-url-duplicated",
        }
      );

      assert.equal(result.short_url, "test-short-url-duplicated");
      assert.notEqual(result_duplicate.short_url, "test-short-url-duplicated");
      assert.equal(
        result.origin_url,
        "https://test.org/abcdef?a=1&b=2&c=3#test-hash-tag"
      );
      assert.equal(
        result_duplicate.origin_url,
        "https://test.org/abcdef?a=1&b=2&c=3#test-hash-tag"
      );
    });
  });

  it("should modify&delete url", function () {
    const storage = new RAWfile();

    assert.ok(
      storage.modify(
        "test-short-url-modify",
        "https://modify-test.org/abcdef?a=1&b=2&c=3#test-hash-tag"
      )
    );
    assert.equal(
      storage.get("test-short-url-modify"),
      "https://modify-test.org/abcdef?a=1&b=2&c=3#test-hash-tag"
    );

    assert.ok(storage.delete("test-short-url-modify"));
  });
});
