import { Router, Request, Response } from "express";
const userHandler = require("../handlers/user.handler.ts");
const authUtils = require("../utils/auth/authUtils");

export const userRouter = () => {
  const router = Router();
  console.log("called");
  router.get("/hello", (req: Request, res: Response) => {
    return res
      .status(200)
      .json({ response: "You have just hit the hello endpoint" });
  });

  router.post("/register", function (req, res, next) {
    userHandler
      .handleUser("register", {
        email: "eric@gmail.com",
        username: "eric",
        password: "eric",
      })
      .then((response: String) => {
        return res
          .status(200)
          .json({ response: "You have just hit the hello endpoint" });
      })
      .catch((error: String) => console.log(error, "error has occured"));
  });

  return router;
};
