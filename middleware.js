'use strict';

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

module.exports = {
  handleError,
  validateRequest
};