import { Router, Request, Response } from "express";
const photoHandler = require("../handlers/photo.handler.ts");
//IMporting the passport library
const passport = require("passport");
//Passing the imported passport module into the configuration function
require("../utils/auth/passport")(passport);

const Multer = require("multer");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

export const photoRouter = () => {
  const router = Router();

  router.get("/upload", async function (req: Request, res: Response) {
    return res.status(200).json({ response: "Upload route is working :)" });
  });

  // Process the file upload and upload to Google Cloud Storage.
  router.post(
    "/upload/:email",
    passport.authenticate("jwt", { session: false }),
    multer.single("file"),
    async function (req: Request, res, next) {
      photoHandler
        .handlePhoto("upload", req)
        .then((response: any) => {
          return res.status(response.status).json({ response });
        })
        .catch((error: any) => {
          return res.status(error.status).json({ error });
        });
    }
  );

  // Get all public photos
  router.get("/get/public", async function (req: Request, res, next) {
    photoHandler
      .handlePhoto("get/public", req)
      .then((response: any) => {
        return res.status(response.status).json({ response });
      })
      .catch((error: any) => {
        return res.status(error.status).json({ error });
      });
  });

  //Get all photos belonging to a particular user
  router.put(
    "/get/private",
    passport.authenticate("jwt", { session: false }),
    async function (req: Request, res, next) {
      photoHandler
        .handlePhoto("get/private", req)
        .then((response: any) => {
          return res.status(response.status).json({ response });
        })
        .catch((error: any) => {
          return res.status(error.status).json({ error });
        });
    }
  );

  // Like a photo given an ID
  router.put(
    "/like",
    passport.authenticate("jwt", { session: false }),
    async function (req: Request, res, next) {
      photoHandler
        .handlePhoto("like", req)
        .then((response: any) => {
          return res.status(response.status).json({ response });
        })
        .catch((error: any) => {
          return res.status(error.status).json({ error });
        });
    }
  );

  router.put(
    "/toggle/public",
    passport.authenticate("jwt", { session: false }),
    async function (req: Request, res, next) {
      photoHandler
        .handlePhoto("toggle/public", req)
        .then((response: any) => {
          return res.status(response.status).json({ response });
        })
        .catch((error: any) => {
          return res.status(error.status).json({ error });
        });
    }
  );

  router.delete(
    "/delete",
    passport.authenticate("jwt", { session: false }),
    async function (req: Request, res, next) {
      photoHandler
        .handlePhoto("delete", req)
        .then((response: any) => {
          return res.status(response.status).json({ response });
        })
        .catch((error: any) => {
          return res.status(error.status).json({ error });
        });
    }
  );

  return router;
};
