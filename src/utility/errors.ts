import { HTTPStatusCode } from "./status.code";

class BaseError extends Error {
  status: number;
  error: any;

  constructor(status: number, message: string, error?: any) {
    super(message);
    this.status = status;
    this.error = error;
  }
}

class NotFoundError extends BaseError {
  constructor(message = "The requested data not found.") {
    super(HTTPStatusCode.NOT_FOUND, message);
  }
}

class InternalServerError extends BaseError {
  constructor(message = "Internal Server Error.") {
    super(HTTPStatusCode.INTERNAL_SERVER, message);
  }
}

class BadRequestError extends BaseError {
  constructor(message = "Bad Request.", error?: any) {
    super(HTTPStatusCode.BAD_REQUEST, message, error);
  }
}

class InvalidCredentialError extends BaseError {
  constructor(message = "invalid credentials") {
    super(HTTPStatusCode.UNAUTHORIZED, message);
  }
}

class UnauthorizedError extends BaseError {
  constructor(message = "unauthorized") {
    super(HTTPStatusCode.UNAUTHORIZED, message);
  }
}

class ForbiddenAccessError extends BaseError {
  constructor(message = "Forbidden Access.") {
    super(HTTPStatusCode.FORBIDDEN, message);
  }
}

class ConflictError extends BaseError {
  constructor(message = "email taken") {
    super(HTTPStatusCode.CONFLICT, message);
  }
}

export default {
  BaseError,
  NotFoundError,
  InternalServerError,
  BadRequestError,
  InvalidCredentialError,
  UnauthorizedError,
  ForbiddenAccessError,
  ConflictError,
};
