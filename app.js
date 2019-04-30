'use strict';

require('dotenv').config();
const {validateRequest, handleError} = require('./middleware');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const movies = require('./movie-data');
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(validateRequest);
app.use(handleError);

app.get('/movie', (req, res, next) => {
  let {genre, country, avg_vote} = req.query;
  let results = movies;

  if (genre) {
    if (Number(genre)) {
      const error = new Error('genre must be a string');
      res.status(400);
      next(error);
    }
    results = results.filter(movie => movie.genre.toLowerCase() === genre.toLowerCase());
  }

  if (country) {
    if (Number(country)) {
      const error = new Error('country must be a string');
      res.status(400);
      next(error);
    }
    results = results.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()));
  }

  if (avg_vote) {
    avg_vote = Number(avg_vote);
    if (!avg_vote) {
      const error = new Error('avg_vote must be a number');
      res.status(400);
      next(error);
    }
    results = results.filter(movie => movie.avg_vote >= avg_vote);
  }

  res.json(results);
});

app.listen(3000, () => {
  console.log('server running on port 3000');
});