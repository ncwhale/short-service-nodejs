// This is an example storage for shorten URL.
// We just read a raw file and splited by new line.
// 1st line is the shorten URL, 2nd line is the original URL.
// and so on.
// ALL data is stored in memory.

"use strict";
const crypto = require("crypto");

class RawFileStorage {
  constructor(filePath) {
    this.store = {};
    // TODO: Read file and store data.
  }

  static generateShortUrl(byte_length) {
    let buf = crypto.randomBytes(byte_length);
    return (
      buf
        .toString("base64")
        // for URL safe.
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
    );
  }

  create(origin_url, params) {
    // Generate a shorten URL.
    // TODO: Use config for byte length.
    let short_url = RawFileStorage.generateShortUrl(8);

    // Skip duplicated URL.
    while (short_url in this.store) {
      short_url = RawFileStorage.generateShortUrl(8);
    }

    // Store it in memory.
    this.store[short_url] = origin_url;
    return short_url; // return shorten URL, without prefix.
  }

  get(short_url) {
    return this.store[short_url]; // return original URL.
  }

  delete(short_url) {
    return delete this.store[short_url]; // return true if success.
  }
}

module.exports = RawFileStorage;
