const { StatusCodes } = require('http-status-codes');
const messages = {
  en: require('../i18n/en.json'),
  fr: require('../i18n/fr.json'),
};

const sendResponse = (res, lang, key, data = null, status = StatusCodes.OK) => {
  const message = key
    .split('.')
    .reduce(
      (obj, k) => (obj && obj[k] !== undefined ? obj[k] : null),
      messages[lang],
    );
  return res.status(status).json({
    success: true,
    message: message || key,
    data,
  });
};

const sendError = (res, lang, key, status = 400) => {
  const message = key
    .split('.')
    .reduce(
      (obj, k) => (obj && obj[k] !== undefined ? obj[k] : null),
      messages[lang],
    );
  return res.status(status).json({
    success: false,
    message: message || key,
  });
};

module.exports = {
  sendResponse,
  sendError,
};
