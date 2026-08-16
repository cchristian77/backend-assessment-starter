// Code Review #10 Add Meaningful Unit Test
import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./helpers";

describe("POST /auth/login", () => {
  it("returns a token for valid credentials", async () => {
    const now = Math.floor(Date.now() / 1000);
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "alice@example.com", password: "password1" })
      .expect(200);

    expect(response.body.data.access_token).toEqual(expect.any(String));
    expect(response.body.data.token_type).toBe("Bearer");
    expect(response.body.data.expires_at).toBeGreaterThanOrEqual(now + 3600);
    expect(response.body.data.expires_at).toBeLessThanOrEqual(now + 3601);
  });

  it("returns 401 for the wrong password", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "alice@example.com", password: "wrong-password" })
      .expect(401);

    expect(response.body.message).toBe("invalid credentials");
  });

  it("does not authenticate SQL injection in the email", async () => {
    await request(app)
      .post("/auth/login")
      .send({ email: "alice@example.com'--", password: "password1" })
      .expect(401);
  });

  it("returns 400 when the payload is invalid", async () => {
    await request(app)
      .post("/auth/login")
      .send({ email: "", password: "" })
      .expect(400);
  });
});
