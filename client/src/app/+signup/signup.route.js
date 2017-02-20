;(function() {
  'use strict';

  angular
    .module('app.signup')
    .config(AppConfig);

  /* @ngInject */
  function AppConfig($stateProvider) {

    $stateProvider
      .state({
        name: 'signup',
        url: '/signup',
        views: {
          'main@': {
            templateUrl: 'app/+signup/signup.html',
            controller: 'SignupController',
            controllerAs: 'vm'
          }
        },
        data: {
          permissions: {
            except: ['isLoggedIn'],
            redirectTo: 'dashboard'
          }
        }
      });
  }

})();
