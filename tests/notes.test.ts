// Code Review #10 Add Meaningful Unit Test
import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app, bearer, loginAs } from "./helpers";
import NoteRepository from "../src/repository/note.repository";
import NoteService from "../src/service/note.service";
import Errors from "../src/utility/errors";

describe("NoteRepository", () => {
  const repository = new NoteRepository();

  it("throws NotFoundError when the note does not exist", () => {
    expect(() => repository.findByIdAndUserId(9999, 1)).toThrow(Errors.NotFoundError);
  });
});

describe("NoteService", () => {
  const service = new NoteService();
  const repository = new NoteRepository();

  it("throws NotFoundError when the note belongs to another user", () => {
    const [bobNote] = repository.findAllByUserId(2);

    expect(bobNote).toBeDefined();
    expect(() => service.getById(bobNote.id, 1)).toThrow(Errors.NotFoundError);
  });
});

describe("notes api", () => {
  let aliceToken: string;
  let bobToken: string;

  beforeAll(async () => {
    aliceToken = await loginAs("alice@example.com", "password1");
    bobToken = await loginAs("bob@example.com", "password2");
  });

  it("returns 401 when the request is unauthenticated", async () => {
    await request(app).get("/notes").expect(401);
    await request(app).get("/notes/1").expect(401);
    await request(app)
      .post("/notes")
      .send({ title: "x", body: "y" })
      .expect(401);
  });

  it("returns 401 when the Authorization scheme is not Bearer", async () => {
    await request(app)
      .get("/notes")
      .set({ Authorization: aliceToken })
      .expect(401);
  });

  it("returns 401 when the token is expired", async () => {
    const expiredToken = jwt.sign(
      { userId: 1, email: "alice@example.com", exp: Math.floor(Date.now() / 1000) - 10 },
      process.env.JWT_SECRET as string
    );

    const response = await request(app)
      .get("/notes")
      .set(bearer(expiredToken))
      .expect(401);

    expect(response.body.message).toBe("Token is expired.");
  });

  it("lists only the current user's notes", async () => {
    const response = await request(app)
      .get("/notes")
      .set(bearer(aliceToken))
      .expect(200);

    const titles = response.body.data.map((note: { title: string }) => note.title);
    expect(titles).toContain("Alice note");
    expect(titles).not.toContain("Bob note");
    expect(response.body.data.every((note: { user_id: number }) => note.user_id === 1)).toBe(
      true
    );
  });

  it("returns 404 when the note belongs to another user", async () => {
    const bobNotes = await request(app)
      .get("/notes")
      .set(bearer(bobToken))
      .expect(200);

    const bobNoteId = bobNotes.body.data[0].id;
    const response = await request(app)
      .get(`/notes/${bobNoteId}`)
      .set(bearer(aliceToken))
      .expect(404);

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.status).toBe(404);
    expect(response.body.message).toBe("The requested data not found.");
  });

  it("returns 404 when the note does not exist", async () => {
    const response = await request(app)
      .get("/notes/9999")
      .set(bearer(aliceToken))
      .expect(404);

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.status).toBe(404);
    expect(response.body.message).toBe("The requested data not found.");
  });

  it("returns 404 when the note id is not a number", async () => {
    const response = await request(app)
      .get("/notes/abc")
      .set(bearer(aliceToken))
      .expect(404);

    expect(response.body.message).toBe("The path not found.");
  });

  it("returns 400 when the note id is less than or equal to 0", async () => {
    const response = await request(app)
      .get("/notes/0")
      .set(bearer(aliceToken))
      .expect(400);

    expect(response.body.message).toBe("note id must be a valid number");
  });

  it("returns the note when the current user owns it", async () => {
    const response = await request(app)
      .get("/notes/1")
      .set(bearer(aliceToken))
      .expect(200);

    expect(response.body.data.title).toBe("Alice note");
    expect(response.body.data.body).toBe("private thoughts");
  });

  it("creates a note for the current user", async () => {
    const response = await request(app)
      .post("/notes")
      .set(bearer(bobToken))
      .send({ title: "Bob extra", body: "only bob should see this" })
      .expect(201);

    const noteId = response.body.data.id;
    expect(response.body.data).toEqual({
      id: expect.any(Number),
      user_id: 2,
      title: "Bob extra",
      body: "only bob should see this",
    });

    await request(app)
      .get(`/notes/${noteId}`)
      .set(bearer(aliceToken))
      .expect(404);

    const owned = await request(app)
      .get(`/notes/${noteId}`)
      .set(bearer(bobToken))
      .expect(200);

    expect(owned.body.data.title).toBe("Bob extra");
  });

  it("returns 400 when create payload is invalid", async () => {
    await request(app)
      .post("/notes")
      .set(bearer(aliceToken))
      .send({ title: "", body: "" })
      .expect(400);
  });

  it("returns 409 when the title is already used by the same user", async () => {
    const response = await request(app)
      .post("/notes")
      .set(bearer(aliceToken))
      .send({ title: "Alice note", body: "another body" })
      .expect(409);

    expect(response.body.message).toBe("Title has already used");
  });
});
