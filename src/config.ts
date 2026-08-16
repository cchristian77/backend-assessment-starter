// Code Review #8 JWT Configruation
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

export const config = {
  jwtSecret: process.env.JWT_SECRET,
  dbPath: process.env.DB_PATH || "notes.db",
  port: Number(process.env.PORT) || 3000,
};
