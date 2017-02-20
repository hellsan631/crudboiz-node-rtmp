'use strict';

const path = require('path');
const env  = process.env.NODE_ENV || 'development';

module.exports = function(server) {

  let mountPath = env === 'development' ? 
    'client/src/' :
    'client/dist/';

  let router = server.loopback.Router();

  const staticPath  = path.resolve(__dirname, '../../', mountPath);

  router.use(server.loopback.static(staticPath));

  router.get('/uploads/*', function(req, res, next) {    
    next();
  });

  // any other routes:
  router.get('/*', function(req, res, next) {
    
    if (
      req.originalUrl.includes('api') || 
      req.originalUrl.includes('map')
    ) {
      return next();
    }
    
    res.sendFile(staticPath + '/index.html');
  });

  server.use(router);
};
