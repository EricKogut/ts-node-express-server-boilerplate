const authUtils = require("../utils/auth/authUtils");
import { Photo } from "../models/Photo.model";
import { Router, Request, Response } from "express";
import { User } from "../models/User.model";
const { ObjectId } = require("mongodb");

// [START gae_flex_storage_app]
const { format } = require("util");
const express = require("express");
const Multer = require("multer");

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const { Storage } = require("@google-cloud/storage");

// Instantiate a storage client
const storage = new Storage();

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

interface MulterRequest extends Request {
  files: any;
}

// A bucket is a container for objects (files).
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

/* Actual Handler */
function handlePhoto(endpoint: String, data: Object) {
  switch (endpoint) {
    case "upload":
      return handleUpload(data);
    case "get/public":
      return handleGetPublic(data);
    case "get/private":
      return handleGetPrivate(data);
    case "like":
      return handleLike(data);
    case "toggle/public":
      return handleTogglePhoto(data);
    case "delete":
      return handleDelete(data);
  }
  return null;
}

function handleUpload(req: any) {
  return new Promise((resolve, reject) => {
    if (!req.params) {
      reject({
        status: 403,
        message: "No email given!",
      });
    }

    const multerRequest = (req as MulterRequest).files;
    if (!multerRequest.file) {
      reject({
        status: 400,
        message: "No file selected",
      });
    }

    const hash = (Math.random() + 1).toString(36).substring(7);

    const fileExtension = multerRequest.file.name.split(".").pop();

    const fileExtensions = ["jpeg", "jfif", "gif", "jpg", "png", "svg"];

    if (fileExtensions.indexOf(fileExtension.toLowerCase()) === -1) {
      resolve({
        status: 406,
        message: "Faulty file",
      });
    } else {
      const stream = require("stream"),
        dataStream = new stream.PassThrough(),
        gcFile = bucket.file(hash + "." + fileExtension);

      dataStream.push(multerRequest.file.data);
      dataStream.push(null);

      dataStream
        .pipe(
          gcFile.createWriteStream({
            resumable: false,
            validation: false,
            metadata: { "Cache-Control": "public, max-age=31536000" },
          })
        )
        .on("error", (error: Error) => {
          reject({
            status: 500,
            message: "Error processing your request, see below",
            error: error,
          });
        })
        .on("finish", () => {
          //Creating a new user
          const newPhoto = new Photo({
            name: multerRequest.file.name,
            owner: req.params.email,
            url:
              "https://storage.googleapis.com/nautical-photo-pictures/" +
              hash +
              "." +
              fileExtension,
            public: true,
            likes: 0,
          });

          try {
            newPhoto.save().then((photo) => {
              //This function grabs the id off the user object
              resolve({
                status: 200,
                message: "File successfully uploaded!",
                photo: photo,
              });
            });
          } catch (err) {
            reject({
              status: 500,
              success: false,
              message: err,
            });
          }
        });
    }
  });
}

function handleGetPublic(req: any) {
  return new Promise((resolve, reject) => {
    Photo.find({ public: true })
      .sort({ createdAt: -1 })
      .then((photos) => {
        resolve({ status: 200, success: true, message: photos });
      })
      .catch((err) => {
        reject({ status: 500, success: true, message: "issue getting photos" });
      });
  });
}

function handleGetPrivate(req: any) {
  return new Promise((resolve, reject) => {
    //First seeing if the password and email combo works
    User.find({ username: req.body.owner, password: req.body.hash })

      .then((user) => {
        //If the user exists wrt the password email combo, get the images
        Photo.find({ owner: req.body.owner })
          .sort({ createdAt: -1 })
          .then((photos) => {
            resolve({ status: 200, success: true, message: photos });
          })
          .catch((err) => {
            reject({
              status: 500,
              success: true,
              message: "Issue geting photos" + err,
            });
          });
      })
      .catch((err) => {
        reject({
          status: 403,
          success: true,
          message: "You are not authorized to get this photo" + err,
        });
      });
  });
}

function handleLike(req: any) {
  return new Promise((resolve, reject) => {
    Photo.updateOne({ _id: new ObjectId(req.body.id) }, { $inc: { likes: 1 } })
      .then((photo) => {
        resolve({ status: 200, success: true, message: "Liked image" });
      })
      .catch((err) => {
        reject({
          status: 500,
          success: true,
          message: "issue liking phot photos" + err,
        });
      });
  });
}

// Will make a photo that was public => private, vice versa
function handleTogglePhoto(req: any) {
  return new Promise((resolve, reject) => {
    Photo.findOne({ _id: new ObjectId(req.body.body.id) })
      .then((photo: any) => {
        const isPublic = !photo.public;
        Photo.findByIdAndUpdate(
          { _id: new ObjectId(req.body.body.id) },
          { public: isPublic }
        )
          .then((updatedPhoto) => {
            console.log(updatedPhoto, "has been toggled");

            resolve({
              status: 200,
              success: true,
              message: "Changed the visiblility of the photo",
            });
          })
          .catch((err) => {
            reject({
              status: 500,
              success: true,
              message:
                "We found the photo, but there was an issue toggling the view of the photo" +
                err,
            });
          });
      })
      .catch((err) => {
        reject({
          status: 500,
          success: true,
          message: "Issue toggling the view of the photo" + err,
        });
      });
  });
}

function handleDelete(req: any) {
  return new Promise((resolve, reject) => {
    Photo.findOneAndDelete({ _id: new ObjectId(req.body.id) })
      .then((photo) => {
        resolve({ status: 200, success: true, message: "Deleted image" });
      })
      .catch((err) => {
        reject({
          status: 500,
          success: true,
          message: "Issue delete the photo" + err,
        });
      });
  });
}

module.exports.handlePhoto = handlePhoto;
