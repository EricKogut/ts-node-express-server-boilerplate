
// Importing deps
require('dotenv').config();
const express = require('express');
import { Router, Request, Response } from 'express';
var cors = require('cors');

// Declaring mongo database
import { connectDB } from './db';

// Declaring app and port
const app = express();
const port = process.env.PORT || 5000;

// Creating DB Connection
connectDB();

// Starting express server
app.listen(port, () => console.log(`Server running on port ${port}`));

 // Default display
app.get('/', (req: Request, res: Response) =>
  res.sendFile(__dirname + '/index.html')
);
 