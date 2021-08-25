import { Router, Request, Response } from "express";
import { User } from "../models/User.model";
const userHandler = require("../handlers/user.handler.ts");
const utils = require("../utils/auth/authUtils");

export const userRouter = () => {
  const router = Router();
  console.log("called");
  router.get("/hello", (req: Request, res: Response) => {
    return res
      .status(200)
      .json({ response: "You have just hit the hello endpoint" });
  });

  router.post("/register", function (req, res, next) {
    userHandler.handleUser("register", "data");
    return res
      .status(200)
      .json({ response: "You have just hit the hello endpoint" });
  });

  return router;
};
