module.exports = (req, res, next) => {
  const lang =
    req.headers['accept-language'] ||
    req.query.lang ||
    process.env.DEFAULT_LANGUAGE ||
    'en';

  req.lang = ['en', 'fr'].includes(lang) ? lang : 'en';
  next();
};
