import { Note, NoteWithAuthor } from "../../domain/note";

export class NoteResponse {
  id: number;
  user_id: number;
  title: string;
  body: string;
  author?: string | null;

  constructor(note: Note | NoteWithAuthor) {
    this.id = note.id;
    this.user_id = note.user_id;
    this.title = note.title;
    this.body = note.body;
    if ("author" in note) {
      this.author = note.author;
    }
  }
}
