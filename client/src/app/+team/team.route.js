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
      streamList: listResolver,
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
  function listResolver($q, $localForage) {
    let deferred = $q.defer();

    $localForage
      .getItem('channelList')
      .then((list) => {
        if (list) return deferred.resolve(list);

        else deferred.resolve({});
      });
    
    return deferred.promise;
  }

  /* @ngInject */
  function clientResolver(Deep) {
    return Deep.getClient();
  }
})();
