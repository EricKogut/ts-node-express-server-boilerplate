import { Router, Request, Response } from "express";
const userHandler = require("../handlers/user.handler.ts");
//IMporting the passport library
const passport = require('passport');
//Passing the imported passport module into the configuration function
require('../utils/auth/passport')(passport)

export const userRouter = () => {
  const router = Router();

  router.get(
    "/authorized",
    passport.authenticate("jwt", { session: false }),
    (req: Request, res: Response) => {
      return res.status(200).json({ response: "You are authenticated :)" });
    }
  );

  router.post("/register", function (req, res, next) {
    userHandler
      .handleUser("register", req.body)
      .then((response: String) => {
        return res.status(200).json({ response: response });
      })
      .catch((error: String) => console.log(error, "error has occured"));
  });

  router.post("/login", function (req, res, next) {
    userHandler
      .handleUser("login", req.body)
      .then((response: String) => {
        return res.status(200).json({ response: response });
      })
      .catch((error: String) => console.log(error, "error has occured"));
  });

  return router;
};
