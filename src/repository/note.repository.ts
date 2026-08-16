// CODE REVIEW #2: Domain, Controller, Service, Repository Layer
import { db } from "../database/client";
import { Note, NoteProps, NoteWithAuthor } from "../domain/note";
import Errors from "../utility/errors";

export default class NoteRepository {
  // Code Review #4 Note Endpoint Improvement
  findAll(userId: number): NoteWithAuthor[] {
    const data = db
      .prepare(
        `SELECT notes.id, notes.user_id, notes.title, notes.body, users.email AS author
         FROM notes
         LEFT JOIN users ON users.id = notes.user_id
         WHERE notes.user_id = ?`
      )
      .all(userId) as NoteWithAuthor[];

    if (!data || data.length === 0) {
      return [];
    }

    return data;
  }

  // CODE REVIEW #3: SQL Injection
  findById(id: number): Note {
    const data = db.prepare("SELECT * FROM notes WHERE id = ?").get(id) as
      | NoteProps
      | undefined;

    if (!data) {
      throw new Errors.NotFoundError();
    }

    return new Note(data);
  }

  insert(userId: number, title: string, body: string): Note {
    try {
      const data = db
        .prepare("INSERT INTO notes (user_id, title, body) VALUES (?, ?, ?)")
        .run(userId, title, body);

      return new Note({
        id: Number(data.lastInsertRowid),
        user_id: userId,
        title,
        body,
      });
    } catch (err) {
      if (err instanceof Error && err.message.toUpperCase().includes("UNIQUE")) {
        throw new Errors.ConflictError("Title has already used");
      }
      throw err;
    }
  }
}
