;(function () {
  'use strict';

  angular
   .module('app.core')
   .factory('Deep', Deep);

  /* @ngInject */
  function Deep($window, deepstream) {
    return {
      getClient: getClient
    };

    function getClient() {

      let location = $window.location.hostname;

      if (location === 'localhost') {
        location += `:${$window.location.port}`;
      }
        
      return deepstream(location).login();
    }
  }
})();