;(function() {
  'use strict';

  angular
    .module('app.guide')
    .config(RouteConfig);

  /* @ngInject */
  function RouteConfig($stateProvider) {

    $stateProvider
      .state({
        name: 'guide',
        url: '/guide',
        views: {
          'main@': {
            templateUrl: 'app/+guide/guide.html',
            controller: 'GuideController',
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
