;(function() {
  'use strict';

  angular
    .module('app.team')
    .config(RouteConfig);

  /* @ngInject */
  function RouteConfig($stateProvider) {

    const VIEWS = {
      'main@': {
        templateUrl: 'app/+team/team.html',
        controller: 'TeamController',
        controllerAs: 'vm'
      }
    };

    const RESOLVER = {
      client: clientResolver
    };

    $stateProvider
      .state({
        name: 'team',
        url: '/team',
        views: VIEWS,
        resolve: RESOLVER
      });
     
  }

  /* @ngInject */
  function clientResolver(Deep) {
    return Deep.getClient();
  }
})();
