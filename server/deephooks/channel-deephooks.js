module.exports = (Channel) => { 
  let deepclient;

  Channel.observe('before save', function(ctx, next) {
    if (!deepclient)
      deepclient = Channel.app.deepclient;

    let accessor = 'data';

    if (ctx.instance) {
      accessor = 'instance';
    }

    let channelData = ctx[accessor];

    deepclient 
      .record.getRecord(`streams/${channelData.username}`)
      .set('channel', channelData);

    next();
  });

};