// CODE REVIEW #2: Domain, Controller, Service, Repository Layer
import { db } from "../database/client";
import { User, UserProps } from "../domain/user";
import Errors from "../utility/errors";

export default class UserRepository {
  // CODE REVIEW #3: SQL Injection
  findByEmailAndPassword(email: string, password: string): User {
    const row = db
      .prepare("SELECT * FROM users WHERE email = ? AND password = ?")
      .get(email, password) as UserProps | undefined;

    if (!row) {
      throw new Errors.NotFoundError();
    }

    return new User(row);
  }

  // CODE REVIEW #3: SQL Injection
  findByEmail(email: string): User {
    const row = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as UserProps | undefined;

    if (!row) {
      throw new Errors.NotFoundError();
    }

    return new User(row);
  }

  // CODE REVIEW #3: SQL Injection
  findById(id: number): User {
    const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as
      | UserProps
      | undefined;

    if (!row) {
      throw new Errors.NotFoundError();
    }

    return new User(row);
  }

  insert(email: string, password: string): User {
    const info = db
      .prepare("INSERT INTO users (email, password) VALUES (?, ?)")
      .run(email, password);

    return new User({
      id: Number(info.lastInsertRowid),
      email,
      password,
    });
  }
}
