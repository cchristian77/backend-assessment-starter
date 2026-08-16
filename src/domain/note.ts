// CODE REVIEW #2: Domain, Controller, Service, Repository Layer
export type NoteProps = {
  id: number;
  user_id: number;
  title: string;
  body: string;
};

export type NoteWithAuthor = NoteProps & {
  author: string | null;
};

export class Note {
  id: number;
  user_id: number;
  title: string;
  body: string;

  constructor(data: NoteProps) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.title = data.title;
    this.body = data.body;
  }
}
