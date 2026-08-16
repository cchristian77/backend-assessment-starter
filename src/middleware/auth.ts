import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {config} from "../config";
import {HTTPStatusCode} from "../utility/status.code";
import ApiResponse from "../api/api.response";
import {logger} from "../utility/logger";

export type AuthPayload = {
  userId: number;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Code Review #8 JWT Configuration
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res
      .status(HTTPStatusCode.UNAUTHORIZED)
      .json(
        new ApiResponse.Error(HTTPStatusCode.UNAUTHORIZED, "unauthorized")
      );
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    return res
      .status(HTTPStatusCode.UNAUTHORIZED)
      .json(
        new ApiResponse.Error(HTTPStatusCode.UNAUTHORIZED, "unauthorized")
      );
  }

  try {
    req.user = jwt.verify(token, config.jwtSecret) as AuthPayload;
    next();
  } catch (err) {
    logger.warn(`Verification token error: ${err}`);
    if (err instanceof jwt.TokenExpiredError) {
      return res
        .status(HTTPStatusCode.UNAUTHORIZED)
        .json(new ApiResponse.Error(
          HTTPStatusCode.UNAUTHORIZED,
          "Token is expired."
        ));
    }

    res
      .status(HTTPStatusCode.UNAUTHORIZED)
      .json(
        new ApiResponse.Error(HTTPStatusCode.UNAUTHORIZED, "unauthorized")
      );
  }
}
