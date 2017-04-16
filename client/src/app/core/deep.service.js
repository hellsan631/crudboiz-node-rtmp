;(function () {
  'use strict';

  angular
   .module('app.core')
   .factory('Deep', Deep);

  /* @ngInject */
  function Deep($localForage, $q, $window, deepstream, Raven) {
    return {
      getClient: getClient,
      liveList: liveList,
      stream: deepstream,
      uuid: uuid
    };

    function uuid(keyLength = 24) {
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let text = '';

      for (let i = 0; i < keyLength; i++) {
        text += possible.charAt(
          Math.floor(Math.random() * possible.length)
        );
      }
          
      return text;
    }

    function getClient() {
      let deferred = $q.defer();

      let location = $window.location.hostname;

      if (location === 'localhost') {
        location += `:${$window.location.port}`;
      }

      $localForage
        .getItem('uuid')
        .then((uuid) => {

          if (!uuid) {
            uuid = uuid();

            $localForage.setItem('uuid', uuid);
          }

          let client = deepstream(location).login({ username: uuid });

          client.on( 'error', (error, event, topic) => {
            Raven.captureMessage(`DS - ${event}`, { 
              extra: {
                error: error,
                event: event,
                topic: topic
              }
            });
          });

          deferred.resolve(client);
        });
      
      return deferred.promise;
    }

    function liveList(list, offline = false) {
      var result = [];
      let foundLive = false;
      let noneLive = true;

      for (let key in list) {
        if (list.hasOwnProperty(key)) {
          let stream = list[key];

          if (stream.info) {
            if (stream.info.active && !offline) {
              result.push(stream);
              foundLive = true;
            } else if (!stream.info.active && offline) {
              result.push(stream);
            }
          }
        }
      }

      if (!foundLive && !offline) {
        noneLive = true;
      } else if (foundLive && !offline){
        noneLive = false;
      }
      
      return {
        result: result,
        noneLive: noneLive
      };
    }
  }
})();