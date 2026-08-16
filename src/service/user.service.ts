// CODE REVIEW #2: Domain, Controller, Service, Repository Layer
import { hashPassword } from "../utility/password";
import UserRepository from "../repository/user.repository";
import Errors from "../utility/errors";
import { RegisterRequest } from "../controller/request/user.request";
import { RegisterResponse } from "../controller/response/user.response";
import { HTTPStatusCode } from "../utility/status.code";
import { logger } from "../utility/logger";

const userRepository = new UserRepository();

export default class UserService {
  register(request: RegisterRequest): RegisterResponse {
    logger.info(`Register with req: ${JSON.stringify({email: request.email})}`);

    try {
      userRepository.findByEmail(request.email);
      throw new Errors.BaseError(HTTPStatusCode.BAD_REQUEST, "Email has already used");
    } catch (err) {
      if (!(err instanceof Errors.NotFoundError)) {
        logger.error(`Register error: ${err}`);
        throw err;
      }
    }

    try {
      userRepository.insert(request.email, hashPassword(request.password));
      return new RegisterResponse();
    } catch (err) {
      logger.error(`Register error: ${err}`);
      throw err;
    }
  }
}
