// import Database from "better-sqlite3";
// better-sqlite3 is commented out because npm install fails on Node 24 / Windows:
// no prebuilt binary, and node-gyp rebuild needs the Visual Studio
// "Desktop development with C++" workload. Using Node built-in sqlite instead.
import { DatabaseSync } from "node:sqlite";
import { config } from "../config";
import { hashPassword } from "../utility/password";

export const db = new DatabaseSync(config.dbPath);
// export const db = new Database(config.dbPath);

db.exec("PRAGMA foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE (user_id, title)
  );
`);

const count = db.prepare("SELECT COUNT(*) as c FROM users").get() as { c: number };
if (count.c === 0) {
  db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(
    "alice@example.com",
    hashPassword("password1")
  );
  db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(
    "bob@example.com",
    hashPassword("password2")
  );
  db.prepare("INSERT INTO notes (user_id, title, body) VALUES (?, ?, ?)").run(
    1,
    "Alice note",
    "private thoughts"
  );
  db.prepare("INSERT INTO notes (user_id, title, body) VALUES (?, ?, ?)").run(
    2,
    "Bob note",
    "bob's secrets"
  );
}
