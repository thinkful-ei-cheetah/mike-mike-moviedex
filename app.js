'use strict';

require('dotenv').config();
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

function handleError(err, req, res, next) {
  res.json({error: err.message });
}

function validateRequest(req, res, next) {
  const authToken = req.get('Authorization') ? req.get('Authorization').split(' ')[1] : null;
  const apiToken = process.env.API_KEY;
  
  if (!authToken) {
    res.status(401);
    const error = new Error('request must include api key inside of Authorization header');
    next(error);
  }
   
  if (authToken !== apiToken) {
    res.status(401);
    const error = new Error('invalid api key given');
    next(error);
  }

  next();
}

app.use(handleError);

app.listen(3000, () => {
  console.log('server running on port 3000');
});