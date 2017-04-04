;(function() {
  'use strict';

  angular
    .module('app.stream')
    .config(RouteConfig);

  /* @ngInject */
  function RouteConfig($stateProvider) {

    $stateProvider
      .state({
        name: 'stream',
        url: '/stream/{username}',
        views: {
          'main@': {
            templateUrl: 'app/+stream/stream.html',
            controller: 'StreamController',
            controllerAs: 'vm'
          }
        },
        resolve: {
          stream: streamResolver,
          member: memberResolver,
          host: hostResolver,
          previous: previous
        }
      });
  }

  /* @ngInject */
  function previous($state) {
    return {
      name: $state.current.name,
      params: $state.params,
      url: $state.href($state.current.name, $state.params)
    };
  }

  /* @ngInject */
  function memberResolver($q, Account, Member) {
    let deferred = $q.defer();

    Member
      .getCurrent()
      .$promise
      .then(deferred.resolve)
      .catch(() => {
        deferred.resolve(Account.getDefaultUser());
      });
    
    return deferred.promise;
  }

  /* @ngInject */
  function hostResolver($q, Member, Account, $stateParams) {
    let deferred = $q.defer();

    let query = {
      filter: {
        where: $stateParams,
        fields: ['username', 'id', 'profileImage']
      }
    };
    
    Member
      .findOne(query)
      .$promise
      .then(deferred.resolve)
      .catch((err) => {
        deferred.resolve(Account.getDefaultStream($stateParams.username));
      });

    return deferred.promise;
  }

  /* @ngInject */
  function streamResolver($q, Channel, $stateParams) {
    let deferred = $q.defer();

    Channel
      .getStreamInfo($stateParams)
      .$promise
      .then((stream) => {
        deferred.resolve(stream);
      })
      .catch(deferred.reject);
    
    return deferred.promise;
  }
})();
