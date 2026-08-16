// Code Review #10 Add Meaningful Unit Test
import { describe, it, expect } from "vitest";
import request from "supertest";
import { app, loginAs } from "./helpers";

describe("POST /users/register", () => {
  it("registers a new user", async () => {
    const email = `user-${Date.now()}@example.com`;

    const response = await request(app)
      .post("/users/register")
      .send({ email, password: "password1" })
      .expect(201);

    expect(response.body.data.ok).toBe(true);

    const token = await loginAs(email, "password1");
    expect(token).toEqual(expect.any(String));
  });

  it("returns 400 when the email is already used", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({ email: "alice@example.com", password: "password1" })
      .expect(400);

    expect(response.body.message).toBe("Email has already used");
  });

  it("returns 400 when the payload is invalid", async () => {
    await request(app)
      .post("/users/register")
      .send({ email: "not-an-email", password: "123" })
      .expect(400);
  });
});
