import request from "supertest";
import { app } from "../src/api/server";

export { app };

export async function loginAs(email: string, password: string): Promise<string> {
  const response = await request(app)
    .post("/auth/login")
    .send({ email, password })
    .expect(200);

  return response.body.data.access_token;
}

export function bearer(token: string) {
  return { Authorization: `Bearer ${token}` };
}
