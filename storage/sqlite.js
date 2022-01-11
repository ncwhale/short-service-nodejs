"use strict";

// This is a sqlite storage for shorten URL.
// Table name is shorten_url.
// Columns are:
//   id: primary key.
//   short_url: shorten URL.
//   origin_url: original URL.
//   created_at: created time.
//   updated_at: updated time.
//

const sqlite = require("sqlite");
const randomBytes = require("crypto").randomBytes;

class SqliteStorage {
  constructor(options) {
    this.options = options;
    this.db = null;
    this.table_name = options.table_name || "shorten_url";
    this.columns = options.columns || {
      id: "INTEGER PRIMARY KEY AUTOINCREMENT",
      short_url: "TEXT",
      origin_url: "TEXT",
      created_at: "TEXT",
      updated_at: "TEXT",
    };
  }

  generateShortUrl(byte_length) {
    let buf = randomBytes(byte_length);
    return buf.toString("base64url");
  }

  async init() {
    if (this.db) return;

    const sqlite3 = require("sqlite3").verbose();
    let db = (this.db = await sqlite.open({
      filename: this.options.db_path,
      driver: sqlite3.cached.Database,
    }));

    // Create table if not exists.
    let sql = `CREATE TABLE IF NOT EXISTS ${this.table_name} (`;
    for (let column in this.columns) {
      sql += `${column} ${this.columns[column]},`;
    }
    sql = sql.slice(0, -1) + ")";

    await db.exec(sql);

    // Create index.
    await db.exec(
      `CREATE UNIQUE INDEX IF NOT EXISTS ${this.table_name}_short_url ON ${this.table_name} (short_url)`
    );
    await db.exec(
      `CREATE INDEX IF NOT EXISTS ${this.table_name}_origin_url ON ${this.table_name} (origin_url)`
    );

    // Prepare statements.
    this.create_stmt =
      await db.prepare(`INSERT INTO ${this.table_name} (short_url, origin_url, created_at, updated_at)
     VALUES ($short_url, $origin_url, $created_at, $updated_at)`);

    this.get_origin_url_stmt = await db.prepare(
      `SELECT origin_url FROM ${this.table_name} WHERE short_url = $short_url`
    );

    this.modify_stmt = await db.prepare(
      `UPDATE ${this.table_name} 
      SET origin_url = $origin_url, updated_at = $updated_at 
      WHERE short_url = $short_url`
    );

    this.delete_stmt = await db.prepare(
      `DELETE FROM ${this.table_name} WHERE short_url = $short_url`
    );
  }

  async create(origin_url, params) {
    let created_at = new Date().toISOString();
    let updated_at = created_at;

    params = params || {};
    let short_url_size = params.short_url_size || 8;
    let short_url = params.short_url || this.generateShortUrl(short_url_size);

    await this.create_stmt.run({
      $short_url: short_url,
      $origin_url: origin_url,
      $created_at: created_at,
      $updated_at: updated_at,
    });

    return { short_url, origin_url, created_at };
  }

  async get(short_url) {
    let result = await this.get_origin_url_stmt.get({ $short_url: short_url });
    return result.origin_url;
  }

  async modify(short_url, origin_url) {
    let updated_at = new Date().toISOString();

    let result = await this.modify_stmt.run({
      $short_url: short_url,
      $origin_url: origin_url,
      $updated_at: updated_at,
    });

    return result.changes > 0;
  }

  async delete(short_url) {
    let result = await this.delete_stmt.run({ $short_url: short_url });
    return result.changes > 0;
  }
}

module.exports = SqliteStorage;
