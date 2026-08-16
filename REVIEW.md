# Code Review

This is a review of the notes API (Express + TypeScript, SQLite). I split the review into into **Should-fix** and **Nice-to-have**, each item covers **the problem**, **why it matters**, and **the fix**.

## Should-fix

### 1. Update `.gitignore`

**Problem:** `.gitignore` only ignores `node_modules/`, `.env` should be included. 

**Why it matters**: Credentials may be leaked if `.env` is pushed.

**Fix** : 
- Load env with `dotenv` at process start, **before** reading config.
- Remove unused `ADMIN_PASSWORD` unless there is a real admin flow.

---

### 2. Separation of concerns

**Problem:** all functionalities reside in the router, i.e.`notes.ts`, `users.ts`, and `auth.ts`. 

**Why it matters:**
- Avoid God class, the codebase will be harder to maintain when as the code is getting larger. 
- The source code becomes hard to test.  
- Need a typed container when receiving data from the database.

**Fix:** Introduce a domain/entity, controller, service, and repository layer in the project for better dividing responsibilities between layers.
- Domain - class representation for each table in the databe. 
- Controller - accept and validate incoming requests before they are processed by the service layer. 
- Service - the core business logic layer. 
- Repository - manages interactions between the application and database.

---

### 3. SQL injection

**Problem:** Security vulnerability of SQL Injection due to string conception in the query, such as `OR 1=1`. 

- Login: `WHERE email = '${email}' AND password = '${hashPassword(password)}'`
- Register: `WHERE email = '${email}'`
- Notes list author lookup: `WHERE id = ${n.user_id}`
- Get note: `WHERE id = ${req.params.id}`

Why it matters: an attacker can access or modify unauthorized data in the database.

**Fix:** Always use query parameters (`?`) in all queries.

---

### 4. Notes endpoint

**Problem:** 
- `GET /notes` runs `SELECT * FROM notes`, then one `SELECT email FROM users` per row, which introduce N+1 query.
- `GET /notes/:id` returns an empty body of `undefined` when the data is not found.

Why it matters: 
- All Notes will be returned including notes that not belong to the current user, e.g. `private thoughts`, causing data leak. 
- Introduce N+1 query when receiving the author of each notes. 
- Query will get slower as the data grow. 

**Fix:** 
- A user should be able to only list/read/update/delete their own notes.
- Use `JOIN` query to `users` table for querying association and relation to fix N+1 query problem.
- The API should return `404` if a note is not found  or `403` if not owner.

--- 

### 5. Error responses leak stack traces

**Problem:** The 500 handler returns `{ error: err.message, stack: err.stack }`.

**Why it matters**: stack traces reveal file paths and internals errors in the code. Clients should only see a generic message.

**Fix:** Return a generic 500 body and log errors that occurred in the server including the stack.

---

### 6. Logging

**Problem:** Implement small logger and use log level info, error, debug, etc. to see what's happening in the server.

**Why it matters**: The log should be written to the log file instead of console. Therefore, every log is recorded to ease debugging in case of error. 

**Fix:** Use a small logger (e.g. `pino` or `winston`) with levels: `error`, `warn`, `info`, `debug`.

---

### 7. Configure CORS properly

**Problem:** Current setup is `cors({ origin: "*", credentials: true })`.

Why it matters:
- Any website can call the API with the user’s cookies. 

**Fix:**
- This API uses `Authorization: Bearer`, so the `credentials: true` may be unnecessary.
- Restrict methods (`GET, POST, PUT, PATCH, DELETE`) and headers (`Content-Type, Authorization`).

---

### 8. JWT configuration

**Problem:** 
- Tokens have no expiration. 
- Login function prints the full token to the console.
- `authMiddleware` does `header.replace("Bearer ", "")` even when the header is missing or uses another scheme.

**Why it matters**: 
- the generated token never expires, causing security issue if token is leaked. 
- a weak secret is easy to guess.
- Any credentials should not be logged.

**Fix:**
- Fail fast if `JWT_SECRET` is not configured in the `.env`.
- Set expiration for auth token. 
- Proper bearer token extraction from the header. `Authorization: Bearer <token>` must be required for authentication, otherwise return `401` unauthorized error. 
- Never log any credentials, such as token, password, etc.

---

### 9. Input validation

**Problem:** Bodies are taken as `any` with no checks for missing attributes, such as email, password, note's title, or body.

**Why it matters**: garbage data & easier injection or abuse. 

**Fix:** Validate incoming requests in the controller before proceeding the request. Return Bad Request `400` response for invalid input.

---

### 10. Add Meaningful Unit Test 

**Problem:** `tests/notes.test.ts` is `expect(1 + 1).toBe(2)`. It does not hit HTTP, SQL, auth, or authorization.

**Why it matters**: unit test is extremly important to test the functionality and edge cases in the system.

**Fix:** : Create unit test for each endpoint `auth.ts`, `user.ts`, and `note.ts` to test how the system behaves. 

---

## Nice-to-have

### 1. Use an input validation library

**Problem:** Request bodies are cast with `as any` and never checked. Manual `if (!email)` checks would be duplicated on every endpoint.

Why it matters: a library gives one schema per DTO, reusable error messages, and inferred types.

**Fix:** Use Zod (or Valibot / Joi) in the controller. Parse `req.body` against a schema; invalid payload → 400 with field errors.

---

### 2. Minimize `any`

**Problem:** `"strict": false` in `tsconfig.json`, and `any` is used for `req.body`, `req.params`, `req.user`, SQLite results, and the error middleware.

Why it matters: TypeScript cannot catch missing fields, wrong column names, or a missing `req.user`.

**Fix:** Enable `"strict": true`. Type request bodies, `req.user`, and repository returns as domain entities. Use Express `Request`, `Response`, `NextFunction`, and `ErrorRequestHandler`.

---

### 3. DB migrations

**Problem:** `src/db.ts` runs `CREATE TABLE IF NOT EXISTS` inline on boot and seeds Alice/Bob if the users table is empty.

**Why it matters**: schema changes are not versioned, so adding a column later is “edit the string and hope existing `notes.db` files still work.” Seed data is also coupled to app boot.

**Fix:** 
- Use a migration library to version every schema change. 
- Move seeds out of boot (`npm run seed`, non-production only).
- Add UNIQUE, NOT NULL, and foreign-key constraints.

---

### 4. Dockerize the API

**Problem:** The app is started with `npm start` on the host. There is no Dockerfile or compose file.

**Why it matters**: local setup depends on the right Node version and native addons; a container makes the runtime reproducible for others and for a later deploy.

**Fix:** Add a `Dockerfile` (and optionally `docker-compose.yml`) that builds the API.

---

# If this API went to production tomorrow

The first three things I would insist on: **(1)** parameterized queries everywhere and stop interpolating SQL — the login and notes-by-id paths are injectable today; **(2)** enforce note ownership so a valid JWT cannot read every row in `notes`; **(3)** stop shipping secrets that are not fit for production — gitignore `.env`, require a strong `JWT_SECRET` with expiry, and never return stack traces or JWTs in logs. Architecture (controllers/services/repositories, migrations, logging, CORS allowlist) should follow immediately, but those three are what actually leak data.

---

