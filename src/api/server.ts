import express from "express";
import cors from "cors";
import { requestLogger } from "../middleware/request.logger";
import { errorHandler } from "../middleware/error.handler";
import registerRouters from "./router";

export const app = express();

app.use(express.json());

// Code Review #7 Configure CORS
app.use(
  cors({
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Code Review #6 Logging
app.use(requestLogger);
registerRouters(app);
app.use(errorHandler);
