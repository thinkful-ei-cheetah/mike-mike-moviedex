'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

console.log(process.env.API_KEY);

const app = express();

app.use(morgan('dev'));

app.listen(3000, () => {
  console.log('server running on port 3000');
});