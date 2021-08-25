
// Importing deps
require('dotenv').config();
const express = require('express');
import { Router, Request, Response } from 'express';

var cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

 // Default display
app.get('/', (req: Request, res: Response) =>
  res.sendFile(__dirname + '/index.html')
);
 