;(function () {
  'use strict';

  angular
   .module('app.core')
   .factory('Account', Account);

  /* @ngInject */
  function Account(randomColor, $q, $localForage) {
    return {
      getDefaultUser: getDefaultUser,
      setAuthVerified: setAuthVerified,
      isAuthVerified: isAuthVerified,
      getDefaultStream: getDefaultStream
    };

    function getDefaultUser() {
      return {
        username: 'Anonomoose',
        color: randomColor({ luminosity: 'dark' })
      };
    }

    function getDefaultStream(username) {
      return {
        active: false,
        viewerCount: 0,
        name: username,
        image: `http://crudboiz.tv/img/channel/channel_${username}.png`,
        poster: `http://crudboiz.tv/img/thumbs/thumb_${username}.jpg`,
        rtmpUrl: `rtmp://crudboiz.tv/live&${username}`,
        hlsUrl: `http://hls.crudboiz.tv/hls/${username}.m3u8`,
        dashUrl: `http://hls.crudboiz.tv/dash/${username}.mpd`,
        dead: true
      };
    }

    function isAuthVerified() {
      var deferred = $q.defer();

      $localForage
        .getItem('lastLogin')
        .then((lastLogin) => {
          if (!lastLogin) {
            deferred.resolve(false);
          }
          
          var now = new Date();
          var loginLimit = new Date(now);

          loginLimit.setMinutes( now.getMinutes() - 90 );

          if (typeof lastLogin === 'string') {
            try {
              lastLogin = new Date(lastLogin);
            } catch (e) {
              deferred.resolve(false);
            }
          }

          if (lastLogin > loginLimit) {
            deferred.resolve(true);
          }

          deferred.resolve(false);

        });

      return deferred.promise;
    }

    function setAuthVerified() {
      return $localForage.setItem('lastLogin', new Date());
    }
  }
})();