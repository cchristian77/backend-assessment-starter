// Code Review #6 Logging
import fs from "fs";
import path from "path";
import winston from "winston";

const logDir = path.resolve(__dirname, "../../logs");

if (process.env.NODE_ENV !== "test" && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const transports: winston.transport[] =
  process.env.NODE_ENV === "test"
    ? [new winston.transports.Console({ silent: true })]
    : [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(
              ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
            )
          ),
        }),
        new winston.transports.File({
          filename: path.join(logDir, "app.log"),
        }),
      ];

export const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true })
  ),
  transports,
});
