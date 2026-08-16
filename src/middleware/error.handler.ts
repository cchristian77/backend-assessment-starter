import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { HTTPStatusCode } from "../utility/status.code";
import Errors from "../utility/errors";
import ApiResponse from "../api/api.response";
import { logger } from "../utility/logger";

export const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err) {
    next();
    return;
  }

  // CODE REVIEW #5: Error responses leak stack traces
  // Code Review #6 Logging
  logger.error(`Error occurred: ${err}, stack : ${err.stack}`);

  if (err instanceof Errors.BaseError) {
    res
      .status(err.status)
      .json(new ApiResponse.Error(err.status, err.message, err.error))
      .end();
    return;
  }

  res
    .status(HTTPStatusCode.INTERNAL_SERVER)
    .json(new ApiResponse.Error(
      HTTPStatusCode.INTERNAL_SERVER,
      "Internal Server Error."
    ))
    .end();
};

