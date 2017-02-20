module.exports = (Live) => { 

  Live.auth = (key, name, next) => {
    next();
  };

  Live.remoteMethod(
    'auth',
    {
      http: { path: '/auth', verb: 'get' },
      accepts: [
        { arg: 'key',  type: 'string', required: true },
        { arg: 'name', type: 'string', required: true }
      ],
      returns: { arg: 'body', type: 'object', root: true }
    }
  );

}