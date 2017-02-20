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
      isAuthVerified: isAuthVerified
    };

    function getDefaultUser() {
      return {
        username: 'Anonomoose',
        color: randomColor({ luminosity: 'dark' })
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