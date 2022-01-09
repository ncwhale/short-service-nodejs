// This is an example storage for shorten URL.
// We just read a raw file and splited by new line.
// 1st line is the shorten URL, 2nd line is the original URL.
// and so on.
// ALL data is stored in memory.

"use strict";

class RawFileStorage {
  constructor(filePath) {
    this.store = {};
  }

  create(origin_url, params) {
    // Generate a shorten URL.
    let short_url = "aabbcc";
    // Store it in memory.
    this.store[short_url] = origin_url;
    return short_url; // return shorten URL, without prefix.
  }

  get(short_url) {
    return this.store[short_url]; // return original URL.
  }

  delete(short_url) {
    return (delete this.store[short_url]); // return true if success.
  }
}

module.exports = RawFileStorage;
