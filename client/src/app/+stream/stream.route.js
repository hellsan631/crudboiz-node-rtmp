;(function() {
  'use strict';

  angular
    .module('app.stream')
    .config(RouteConfig);

  /* @ngInject */
  function RouteConfig($stateProvider) {

    const VIEWS = {
      'main@': {
        templateUrl: 'app/+stream/stream.html',
        controller: 'StreamController',
        controllerAs: 'vm'
      }
    };

    const RESOLVER = {
      client: clientResolver,
      stream: streamResolver,
      member: memberResolver,
      host: hostResolver,
      previous: previous
    };

    $stateProvider
      .state({
        name: 'stream',
        url: '/stream/{username}',
        views: VIEWS,
        resolve: RESOLVER
      });
  }

 /* @ngInject */
  function clientResolver(Deep) {
    return Deep.getClient();
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
  function memberResolver($q, Account, Widgets) {
    let deferred = $q.defer();

     Widgets
      .currentMember()
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
  function streamResolver(Channel, $stateParams) {
    return Channel.getStreamInfo($stateParams).$promise;
  }
})();
