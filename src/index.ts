import dotenv from "dotenv";
import path from "path";
import { app } from "./api/server";
import { logger } from "./utility/logger";
import { config } from "./utility/config";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

logger.info(`Starting HTTP server on port ${config.port} ...`);

const server = app.listen(config.port, () => {
  logger.info(`HTTP server is running on port ${config.port}`);
});

const shutdown = (signal: string) => {
  logger.info(`Shutting down HTTP server (${signal}) ...`);
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
