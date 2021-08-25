import { Router, Request, Response } from "express";

export const userRouter = () => {
  const router = Router();

  router.get("/hello", (req: Request, res: Response) => {
    return res
      .status(200)
      .json({ response: "You have just hit the hello endpoint" });
  });

  return router;
};
