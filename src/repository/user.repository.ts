// CODE REVIEW #2: Domain, Controller, Service, Repository Layer
import { db } from "../database/client";
import { User, UserProps } from "../domain/user";
import Errors from "../utility/errors";
import { logger } from "../utility/logger";

export default class UserRepository {
  // CODE REVIEW #3: SQL Injection
  findByEmailAndPassword(email: string, password: string): User {
    try {
      const data = db
        .prepare("SELECT * FROM users WHERE email = ? AND password = ?")
        .get(email, password) as UserProps | undefined;

      if (!data) {
        throw new Errors.NotFoundError();
      }

      return new User(data);
    } catch (err) {
      logger.error(`[REPOSTORY] find user by email and password error : ${err}`);
      throw err;
    }
  }

  // CODE REVIEW #3: SQL Injection
  findByEmail(email: string): User {
    try {
      const data = db
        .prepare("SELECT * FROM users WHERE email = ?")
        .get(email) as UserProps | undefined;

      if (!data) {
        throw new Errors.NotFoundError();
      }

      return new User(data);
    } catch (err) {
      logger.error(`[REPOSITORY] find user by email error : ${err}`);
      throw err;
    }
  }

  // CODE REVIEW #3: SQL Injection
  findById(id: number): User {
    try {
      const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as
        | UserProps
        | undefined;

      if (!row) {
        throw new Errors.NotFoundError();
      }

      return new User(row);
    } catch (err) {
      logger.error(`[REPOSITORY] find user by id error : ${err}`);
      throw err;
    }
  }

  insert(email: string, password: string): User {
    try {
      const info = db
        .prepare("INSERT INTO users (email, password) VALUES (?, ?)")
        .run(email, password);

      return new User({
        id: Number(info.lastInsertRowid),
        email,
        password,
      });
    } catch (err) {
      logger.error(`[Repository] insert user error : ${err}`);
      throw err;
    }
  }
}
