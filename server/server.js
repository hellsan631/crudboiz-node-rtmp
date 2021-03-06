'use strict';

const env       = process.env.NODE_ENV || 'development';

const loopback   = require('loopback');
const boot       = require('loopback-boot');
const path          = require('path');

let keys = require('./datasources.production');       

if (env === 'development') {
  keys = require('./datasources.local');
}

let deepclient = false;
let alreadyInit = false;
let connectedUsers = {};
let bootCheck = {
  deep: false,
  lb: false
};

const Raygun = require('raygun');
const raygun = new Raygun.Client().init({
  apiKey: keys.raygun.token
});

let app = module.exports = loopback();

mountApp(app, boot);

function mountApp(app, boot) {

  const proxy  = require('http-proxy-middleware');

  let endpoints = {
    http: 'http://localhost:6020/deepstream',
    ws: 'ws://localhost:6020/deepstream'
  };

  let opts = {
    onError: function (err, req, res) {
      raygun.send(err);

      console.log(err);
    }
  };
  
  let wsProxy = proxy(endpoints.ws, opts);

  app.use(wsProxy);
  
  app.start = function() {
    // start the web server

    return app.listen(function() {
      app.emit('started');
      
      var baseUrl = app.get('url').replace(/\/$/, '');

      console.log('Web server listening at: %s', baseUrl);

      if (app.get('loopback-component-explorer')) {
        var explorerPath = app.get('loopback-component-explorer').mountPath;
        console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
      }

      app.on('upgrade', wsProxy.upgrade);

      mountDeepstream(app);
      
      mountRaygun(app);
    });
  };

  // Bootstrap the application, configure models, datasources and middleware.
  // Sub-apps like REST API are mounted via boot scripts.
  boot(app, __dirname, function(err) {
    if (err) throw err;

    // start the server if `$ node server.js`
    if (require.main === module)
      app.start();
  });
}


function mountDeepstream(app) {
  const DeepStream = require('deepstream.io');
  const DeepMongo  = require('deepstream.io-storage-mongodb');
  const EventEmitter = require( 'events' ).EventEmitter;
  
  const deepstream = new DeepStream();

  deepstream.set(
    'storage',
    new DeepMongo({
      connectionString: keys.db.url,
      splitChar: '/'
    })
  );

  deepstream.set('port', '6020');

  deepstream.on('error', (err) => {
    raygun.send(err);
  });

  deepstream.on('started', () => {
    initDeepClient(app);
  });

  class AuthHandler extends EventEmitter {
    constructor() {
      // Extend EventEmitter
      super();

      // Or start with false if you need to do some initialisation first
      // and call this.emit( 'ready' ); a bit later
      this.type = 'none';
      this.isReady = true;
    }

    isValidUser(connectionData, authData, callback) {
      if (!authData.username) return callback(new Error('No Username Found'));

      var username = authData.username;

      if (connectedUsers[username] === undefined && username !== 'localhost') {
        connectedUsers[username] = true;
        callback(true, { username: authData.username || 'OPEN' });
      } else {
        callback(true, { username: authData.username || 'OPEN' });
      }

      if (app._updateDeepstreamConnections)
        app._updateDeepstreamConnections();
    }

    onClientDisconnect( username ) {
      delete connectedUsers[username];
    }
  }

  deepstream.set('authenticationHandler', new AuthHandler);
  
  deepstream.start();

  app.deepstream = deepstream;
}

function mountRaygun(app) {
  app.get('remoting').errorHandler = {
    handler: function(error, req, res, next) {
      raygun.send(error);
      
      //delegate the task down the line
      next();
    },
    disableStackTrace: env !== 'production'
  };
}

function initDeepClient(app) {
  if (alreadyInit) return;

  alreadyInit = true;

  const deepClient = require('deepstream.io-client-js');

  deepclient = deepClient(`localhost:6020`).login({username: 'localhost'});

  app.deepclient = deepclient;

  app._updateDeepstreamConnections = () => {
    app.deepclient
      .record.getRecord('crudboiz')
      .set('connected', connectedUsers);
  };

  setInterval(() => {
    checkLiveStreams(app);
  }, 10000);
}

function checkLiveStreams(app) {
  const Channel = app.models.Channel;

  Channel
    .getStatsXML()
    .then((list) => {
      let active = [];

      // Sets streams activity depending on if they are in the live list or not
      const activeList = app.deepclient.record.getList('streams/active');
      const streamerList = app.deepclient.record.getList('streams');
      let allStreams = streamerList.getEntries();
      let pastList = activeList.getEntries();

      for (let i = 0; i < list.length; i++) {
        if (list[i] && list[i].name) {
          active.push({
            name: list[i].name,
            viewerCount: list[i].viewerCount,
            poster: list[i].poster
          });
        }
      }

      // Sets our streamlist up
      app.deepclient
        .record.getRecord('crudboiz')
        .set('streamlist', active);

      // Sets up our user info for each stream
      active.forEach(({ name, viewerCount }) => {
        for (let i = 0; i < list.length; i++) {
          if(list[i] && list[i].name === name) {
            let recordId = `streams/${name}`;
            let item = list[i];

            let statistics = JSON.parse(JSON.stringify(list[i].statistics));

            // Cleanup the list statistics
            delete list[i].meta;
            delete list[i].statistics;

            // Here we are setting the data for the above record
            let record = app.deepclient.record.getRecord(recordId);

            record.set('info', list[i]);
            record.set('statistics', statistics);

            // And here we are adding it to our streams collection (list)
            if (!pastList.includes(recordId)) {
              activeList.addEntry(recordId);
            }
            if (!allStreams.includes(recordId)) {
              streamerList.addEntry(recordId);
            }
          }
        }
      });

      pastList = activeList.getEntries();

      pastList.forEach((recordId) => {
        let streamActive = false;
        let record = app.deepclient.record.getRecord(recordId);

        for (let i = 0; i < active.length; i++) {
          if (`streams/${active[i].name}` === recordId) {
            streamActive = true;
            break;
          }
        }

        record.whenReady(record => {
          let currentActive = record.get('info.active');

          if (currentActive !== streamActive) {
            record
              .set('info.active', streamActive)
              .set('info.lastOnline', new Date());
          }
        });

        if (!streamActive) {
          activeList.removeEntry(recordId);
        }
      });

      return;
    });
      
}


