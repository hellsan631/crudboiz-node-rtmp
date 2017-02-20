const env  = process.env.NODE_ENV || 'development';

module.exports = function(app) {
  if (env === 'production') {
    app.use(function(req, res, next) {
      let isSecure = (req.secure) ||
        (req.connection.encrypted) ||
        (req.headers['front-end-https'] === 'on') ||
        (req.headers['x-forwarded-proto'] === 'https');

      if (isSecure) {
        res.redirect(`http://${req.host}${req.originalUrl}`);
      }else{
        next();
      }
    });
  }
};