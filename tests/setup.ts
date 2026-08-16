import { afterAll } from "vitest";
import { existsSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
process.env.DB_PATH =
  process.env.DB_PATH || join(tmpdir(), `notes-test-${process.pid}.db`);

afterAll(() => {
  const dbPath = process.env.DB_PATH;
  if (!dbPath || dbPath === ":memory:") {
    return;
  }
  for (const file of [dbPath, `${dbPath}-journal`, `${dbPath}-wal`, `${dbPath}-shm`]) {
    try {
      if (existsSync(file)) {
        unlinkSync(file);
      }
    } catch {
      // Windows can keep the SQLite file locked until the process exits.
    }
  }
});
