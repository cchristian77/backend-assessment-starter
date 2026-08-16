// CODE REVIEW #2: Domain, Controller, Service, Repository Layer
import express, { Request, Response, NextFunction } from "express";
import UserService from "../service/user.service";
import { RegisterRequest } from "./request/user.request";
import { SuccessResponse } from "../api/api.response";
import { HTTPStatusCode } from "../utility/status.code";

const userService = new UserService();

const register = (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = RegisterRequest.create(req.body);
    const registerResponse = userService.register(request);

    return res
      .status(HTTPStatusCode.CREATED)
      .json(new SuccessResponse(
        registerResponse,
        HTTPStatusCode.OK,
        "User is successfully registered."
      ));
  } catch (err) {
    next(err);
  }
};

const router = express.Router();
router.post("/register", register);

export default router;
