(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('httpLoader', httpLoader);

  function httpLoader($q, $rootScope, $timeout) {

    var numLoadings = 0;

    return {
      request: function (config) {

        numLoadings++;

        // Show loader
        $rootScope.showTopLoader = true;
        return config || $q.when(config);

      },
      response: function (response) {

        if ((--numLoadings) === 0) {

          // Hide loader
          $timeout(function() {
            if (numLoadings === 0)
              $rootScope.showTopLoader = false;
          }, 100);
        }

        return response || $q.when(response);

      },
      responseError: function (response) {

        if (!(--numLoadings)) {

          // Hide loader
          $rootScope.showTopLoader = false;
        }

        return $q.reject(response);
      }
    };
  }
})();