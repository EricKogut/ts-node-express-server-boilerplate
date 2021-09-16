
// Importing deps
require('dotenv').config();
const express = require('express');
import { Router, Request, Response, NextFunction } from "express";
const bodyParser = require("body-parser");

// Declaring mongo database
import { connectDB } from "./db";

// Declaring app and port
const app = express();
const port = process.env.PORT || 5000;

///////////////////////////
/* Routes */
import { userRouter } from "./routes/user.routes";
// Mounting middleware to app
app.use("/user", userRouter());
///////////////////////////

//Adding middleware for requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Adding logging for request
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.method + " request for " + req.url);
  next();
});

// Starting express server
const server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);

// Creating DB Connection
connectDB();

// Default display
app.get("/", (req: Request, res: Response) =>
  res.sendFile(__dirname + "/index.html")
);

module.exports = server;