var request = require('request-promise');

module.exports = (Live) => { 

  Live.auth = (key, name, next) => {

    let Member = Live.app.models.Member;

    Member
      .findOne(
        {
          where: {
            rtmpKey: key
          }
        }
      )
      .then((member) => {
        if (!member) {
          return next(new Error('This Key is not valid'));
        }

        if (!member.enablePrivateMode) {
          return sendDiscordAlert();
        } else {
          return next();
        }
      })
      .catch((err) => {
        console.log(err);
        next();
      });

    function sendDiscordAlert() {
      const WEBHOOK_KEY = `rS6XnhcjDS6ZxU6-CjEIWpp2T-I8AQxE_VCB1aULJVwbfDeLBluRugFGTv19_rEE8jMo`;
      const WEBHOOK_URL = `https://discordapp.com/api/webhooks/304021524325728257/${WEBHOOK_KEY}`;

      let payload = {
        content: `${name} is live on http://crudboiz.tv/stream/${name}`
      };

      let options = {
        uri: WEBHOOK_URL,
        method: 'POST',
        body: payload,
        json: true
      };

      request(options)
        .then(function (res) {
          console.log('body', res);
          next();
        })
        .catch(function (err) {
          console.log(err);
          next();
        });
    }

    
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
  
};