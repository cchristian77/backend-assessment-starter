import { Express } from "express";
import { authMiddleware } from "../middleware/auth";
import authController from "../controller/auth.controller";
import userController from "../controller/user.controller";
import noteController from "../controller/note.controller";
import { HTTPStatusCode } from "../utility/status.code";
import ApiResponse, { SuccessResponse } from "./api.response";

export default function registerRouters(app: Express) {
  app.get("/healthcheck", (req, res) => {
    res
      .status(HTTPStatusCode.OK)
      .json(new SuccessResponse(null, HTTPStatusCode.OK, "service is running"));
  });

  app.use("/auth", authController);
  app.use("/users", userController);
  app.use("/notes", authMiddleware, noteController);

  app.use((req, res) => {
    res
      .status(HTTPStatusCode.NOT_FOUND)
      .json(
        new ApiResponse.Error(HTTPStatusCode.NOT_FOUND, "The path not found.")
      );
  });
}
