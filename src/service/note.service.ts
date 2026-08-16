// CODE REVIEW #2: Domain, Controller, Service, Repository Layer
import NoteRepository from "../repository/note.repository";
import { CreateNoteRequest } from "../controller/request/note.request";
import { NoteResponse } from "../controller/response/note.response";
import { logger } from "../utility/logger";

const noteRepository = new NoteRepository();

export default class NoteService {
  // Code Review #4 Note Endpoint Improvement
  list(userId: number): NoteResponse[] {
    logger.info(`List notes with req: ${JSON.stringify({ userId })}`);

    try {
      const notes = noteRepository.findAllByUserId(userId);
      return notes.map(
        (note) => new NoteResponse({ ...note, author: note.author ?? null })
      );
    } catch (err) {
      logger.error(`List notes error: ${err}`);
      throw err;
    }
  }

  // Code Review #4 Note Endpoint Improvement
  getById(id: number, userId: number): NoteResponse {
    logger.info(`Get note with req: ${JSON.stringify({ id, userId })}`);

    try {
      const note = noteRepository.findByIdAndUserId(id, userId);

      return new NoteResponse(note);
    } catch (err) {
      logger.error(`Get note error: ${err}`);
      throw err;
    }
  }

  create(userId: number, request: CreateNoteRequest): NoteResponse {
    logger.info(
      `Create note with req: ${JSON.stringify({ userId, title: request.title, body: request.body })}`
    );

    try {
      const note = noteRepository.insert(userId, request.title, request.body);
      return new NoteResponse(note);
    } catch (err) {
      logger.error(`Create note error: ${err}`);
      throw err;
    }
  }
}
