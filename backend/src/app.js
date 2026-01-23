const express = require('express');
const path = require('path');
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const whitelistedDomainList = require('./core/whitelistedDomainList');
const apiRateLimiter = require('./core/rateLimiter');
const routes = require('./core/routes');
const languageMiddleware = require('./middlewares/language.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(hpp());
app.use(apiRateLimiter);
app.use(cookieParser());

const corsOptions = {
  origin: (origin, callback) => {
    /* 
      Right now all server-to-server and Postman requests are allowed.
      To increase the security we can add header as 'x-postman' in Postman,
      also store random code in ENV file to check here is origin in undefined.
    */
    if (!origin) return callback(null, true);

    if (whitelistedDomainList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(languageMiddleware);
app.use('/api/v1', routes);
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use(errorMiddleware);

module.exports = app;
