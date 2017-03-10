;(function() {
  'use strict';

  angular
    .module('app.team')
    .config(RouteConfig);

  /* @ngInject */
  function RouteConfig($stateProvider) {

    $stateProvider
      .state({
        name: 'team',
        url: '/team',
        views: {
          'main@': {
            templateUrl: 'app/+team/team.html',
            controller: 'TeamController',
            controllerAs: 'vm'
          }
        },
        resolve: {
          member: memberResolver
        }
      });
     
  }

  /* @ngInject */
  function memberResolver($q, Member) {
    let deferred = $q.defer();
    
    Member
      .getCurrent()
      .$promise
      .then(deferred.resolve)
      .catch(deferred.reject);

    return deferred.promise;

  }
})();
