;(function () {
  'use strict';

  angular
   .module('app.core')
   .factory('Deep', Deep);

  /* @ngInject */
  function Deep($window, deepstream) {
    return {
      getClient: getClient,
      liveList: liveList
    };

    function getClient() {

      let location = $window.location.hostname;

      if (location === 'localhost') {
        location += `:${$window.location.port}`;
      }
        
      return deepstream(location).login();
    }

    function liveList(list, offline = false) {
      var result = {};
      let foundLive = false;
      let noneLive = true;

      angular.forEach(list, (stream, key) => {
        if (!stream.info) return;

        if (stream.info.active && !offline) {
          result[key] = stream;
          foundLive = true;
        } else if (!stream.info.active && offline) {
          result[key] = stream;
        }
      });

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