const randomColor = require('randomcolor');

module.exports = (Member) => {

  Member.observe('before save', (ctx, next) => {
    let accessor = 'data';

    if (ctx.instance) {
      accessor = 'instance';
    }

    if (ctx.isNewInstance) {
      
      const RTMP_KEY = generateKey();
      ctx[accessor].rtmpKey = RTMP_KEY;

      return next();
    }

    Member.app.models.Channel
      .findOne({ where: { memberId: ctx[accessor].id } })
      .then((channel) => {
        channel.color = ctx[accessor].color;

        return channel.save();
      })
      .then(() => {
        next();
      })
      .catch((err) => {
        next(err);
      });
    
  });

  Member.observe('after save', (ctx, next) => {
    if (!ctx.isNewInstance) {
      return next();
    }

    let accessor = 'data';

    if (ctx.instance) {
      accessor = 'instance';
    }

    const Channel = Member.app.models.Channel;
    const COLOR = randomColor({ luminosity: 'dark' });

    const relatedChannel = {
      rtmpKey: ctx[accessor].rtmpKey,
      title: `${ctx[accessor].username}'s Channel`,
      game: 'A Generic Videogame',
      description: '',
      username: ctx[accessor].username,
      memberId: ctx[accessor].id,
      color: COLOR
    };

    ctx[accessor].color = COLOR;

    Channel
      .create(relatedChannel)
      .then((res) => {
        next();
      })
      .catch((err) => {
        next(err);
      });
  });

};

function generateKey(keyLength = 24) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';

  for (let i = 0; i < keyLength; i++) {
    text += possible.charAt(
      Math.floor(Math.random() * possible.length)
    );
  }
      
  return text;
}