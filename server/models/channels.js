const Promise   = require('bluebird');
const config    = require('../config.json');
const deephooks = require('../deephooks/channel-deephooks');

let request = require('request-promise');
let parseString = require('xml2js').parseString;

module.exports = (Channel) => {

  deephooks(Channel);

  Channel.getStatsXML = getStatsXML;
  
  Channel.getAll = (next) => {
    getStatsXML()
      .then((list) => {
        let streams = [];

        for (let i = 0; i < list.length; i++) {
          if (list[i] && list[i].name) {
            streams.push({
              name: list[i].name,
              viewerCount: list[i].viewerCount,
              poster: list[i].poster
            });
          }
        }

        next(null, streams);
      })
      .catch((err) => next(err));
  };
    
  Channel.remoteMethod(
    'getAll',
    {
      http: { path: '/all', verb: 'get' },
      returns: { arg: 'body', type: 'array', root: true }
    }
  );

  Channel.getStreamInfo = (username, next) => {
    getStatsXML(username)
      .then((list) => {

        for (let i = 0; i < list.length; i++) {
          if(list[i] && list[i].name === username) 
            return next(null, list[i]);
        }

        next(null, normalizeStreamFormats(username));
      })
      .catch((err) => next(err));
  };

  Channel.remoteMethod(
    'getStreamInfo',
    {
      http: { path: '/:username/stream', verb: 'get' },
      accepts: [
        { arg: 'username', type: 'string', required: true }
      ],
      returns: { arg: 'body', type: 'object', root: true }
    }
  );

  function getStatsXML(username) {
    return new Promise((resolve, reject) => {
      request
        .get(`${config.serverUrl}/stat.xml`)
        .then((body) => {

          parseString(
            body, 
            { explicitArray: false }, 
            (err, result) => {
              if (err) return reject(err);

              let streams = result.rtmp.server.application.live.stream || {};
                
              if (!Array.isArray(streams))
                streams = [streams];

              for (let i = 0; i < streams.length; i++) {
                streams[i] = normalizeStreamFormats(username, streams[i]);
              }

              return resolve(streams);
            }
          );
        })
        .catch(reject);
    });
  }

  function normalizeStreamFormats(username, stream = {}) {
    let returnStream = {};
    
    if (!stream.client)
      stream.client = [];
      
    if (stream.client && !Array.isArray(stream.client))
      stream.client = [stream.client];

    for (let i = 0; i < stream.client.length; i++) {
      if (
        stream.client[i].address.includes('127.0.0.1') || 
        stream.client[i].address.includes('localhost') ||
        stream.client[i].address.includes('0.0.0.0') ||
        typeof stream.client[i].publishing !== 'undefined'
      ) {
        stream.client.splice(i, 1);
        break;
      }
    }

    returnStream.statistics = stream;
    
    returnStream.name = stream.name || username;
    returnStream.viewerCount = stream.client.length;

    returnStream.image  = `${config.serverUrl}/img/channel/channel_${username || stream.name}.png`;
    returnStream.poster = `${config.serverUrl}/img/thumbs/thumb_${username || stream.name}.jpg`;

    if (stream.name) {
      returnStream.rtmpUrl = `${config.rtmpUrl}/live&${stream.name}`;
      returnStream.hlsUrl = `${config.hlsUrl}/hls/${stream.name}.m3u8`;
      returnStream.dashUrl = `${config.hlsUrl}/dash/${stream.name}.mpd`;
      returnStream.active = true;
    } else {
      returnStream.active = false;
      returnStream.viewerCount = 0;
    }

    return returnStream;
  }
};
