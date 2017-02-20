;(function() {
  'use strict';

  angular
    .module('app.login')
    .config(AppConfig);

  /* @ngInject */
  function AppConfig($stateProvider) {

    $stateProvider
      .state({
        name: 'login',
        url: '/login?token&email',
        title: 'Login',
        views: {
          'main@': {
            templateUrl: 'app/+login/login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
          }
        },
        data: {
          permissions: {
            except: ['isLoggedIn'],
            redirectTo: 'channels'
          }
        }
      });
  }

})();
