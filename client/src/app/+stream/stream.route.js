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
          'navbar@':{
            template: `<back-button></back-button>`,
            controller: function() {},
            controllerAs: 'vm'
          },
          'main@': {
            templateUrl: 'app/+stream/stream.html',
            controller: 'StreamController',
            controllerAs: 'vm'
          }
        },
        resolve: {
          stream: streamResolver,
          member: memberResolver,
          host: hostResolver
        }
      });
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
  function hostResolver(Member, $stateParams) {
    let query = {
      filter: {
        where: $stateParams,
        fields: ['profileImage']
      }
    };
    
    return Member.findOne(query).$promise;
  }

  /* @ngInject */
  function streamResolver($q, Channel, $stateParams) {
    let deferred = $q.defer();

    Channel
      .getStreamInfo($stateParams)
      .$promise
      .then((stream) => {
        console.log(stream);
        deferred.resolve(stream);
      })
      .catch(deferred.reject);
    
    return deferred.promise;
  }
})();
