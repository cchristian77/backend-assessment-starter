// CODE REVIEW #2: Domain, Controller, Service, Repository Layer
import express, { Request, Response, NextFunction } from "express";
import NoteService from "../service/note.service";
import { CreateNoteRequest } from "./request/note.request";
import { SuccessResponse } from "../api/api.response";
import { HTTPStatusCode } from "../utility/status.code";

const noteService = new NoteService();

const list = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Code Review #4 Note Endpoint Improvement
    const result = noteService.list(req.user!.userId);

    return res.status(HTTPStatusCode.OK).json(new SuccessResponse(result));
  } catch (err) {
    next(err);
  }
};

const getById = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Code Review #4 Note Endpoint Improvement
    const result = noteService.getById(Number(req.params.id), req.user!.userId);

    return res.status(HTTPStatusCode.OK).json(new SuccessResponse(result));
  } catch (err) {
    next(err);
  }
};

const create = (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = CreateNoteRequest.create(req.body);
    const result = noteService.create(req.user!.userId, input);

    return res
      .status(HTTPStatusCode.CREATED)
      .json(new SuccessResponse(
        result,
        HTTPStatusCode.CREATED,
        "The requested data is successfully created."
      ));
  } catch (err) {
    next(err);
  }
};

const router = express.Router();
router.get("/", list);
router.get("/:id", getById);
router.post("/", create);

export default router;
