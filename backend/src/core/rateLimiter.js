const rateLimit = require('express-rate-limit');
const { StatusCodes } = require('http-status-codes');

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: StatusCodes.TOO_MANY_REQUESTS,
    message: 'Too many requests. Please try after some time',
  },
});

module.exports = apiRateLimiter;
