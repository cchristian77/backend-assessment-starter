import { Request, Response, NextFunction } from "express";
import { logger } from "../utility/logger";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    logger.info(`[${req.method}] ${req.path} \t| ${res.statusCode} \t| ${Date.now() - start}ms`)
  });

  next();
}
