// CODE REVIEW #2: Domain, Controller, Service, Repository Layer
import express, { Request, Response, NextFunction } from "express";
import AuthService from "../service/auth.service";
import { LoginRequest } from "./request/auth.request";
import { SuccessResponse } from "../api/api.response";
import { HTTPStatusCode } from "../utility/status.code";

const authService = new AuthService();

const login = (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = LoginRequest.create(req.body);

    const result = authService.login(input);

    return res.status(HTTPStatusCode.OK).json(new SuccessResponse(result));
  } catch (err) {
    next(err);
  }
};

const router = express.Router();
router.post("/login", login);

export default router;
