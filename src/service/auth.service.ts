// CODE REVIEW #2: Domain, Controller, Service, Repository Layer
import jwt from "jsonwebtoken";
import { config } from "../utility/config";
import UserRepository from "../repository/user.repository";
import Errors from "../utility/errors";
import { LoginRequest } from "../controller/request/auth.request";
import { LoginResponse } from "../controller/response/auth.response";
import { User } from "../domain/user";
import { logger } from "../utility/logger";
import { hashPassword } from "../utility/password";

const userRepository = new UserRepository();

const TOKEN_EXPIRATION_IN = 3600;

export default class AuthService {
  login(input: LoginRequest): LoginResponse {
    logger.info(`Login with req: ${JSON.stringify({ email: input.email })}`);

    let user: User;

    try {
      user = userRepository.findByEmailAndPassword(
          input.email,
          hashPassword(input.password)
      );
    } catch (err) {
      if (err instanceof Errors.NotFoundError) {
        throw new Errors.InvalidCredentialError();
      }
      logger.error(`Find user by email and password on login error: ${err}`);
      throw err;
    }

    try {
      // Code Review #8 JWT Configuration
      const expiresAt = Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION_IN;
      const token = jwt.sign(
        { userId: user.id, email: user.email, exp: expiresAt },
        config.jwtSecret
      );

      return new LoginResponse(token, expiresAt);
    } catch (err) {
      logger.error(`Verify JWT token error: ${err}`);
      throw err;
    }
  }
}
