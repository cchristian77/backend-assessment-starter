import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    {
      name: "node-sqlite-shim",
      enforce: "pre",
      resolveId(id) {
        if (id === "sqlite" || id === "node:sqlite") {
          return "\0node-sqlite-shim";
        }
      },
      load(id) {
        if (id === "\0node-sqlite-shim") {
          return `
            import { createRequire } from "node:module";
            const sqlite = createRequire(import.meta.url)("node:sqlite");
            export const DatabaseSync = sqlite.DatabaseSync;
            export default sqlite;
          `;
        }
      },
    },
  ],
  test: {
    environment: "node",
    fileParallelism: false,
    setupFiles: ["./tests/setup.ts"],
  },
});
