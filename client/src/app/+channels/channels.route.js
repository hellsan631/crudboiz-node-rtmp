;(function() {
  'use strict';

  angular
    .module('app.channels')
    .config(RouteConfig);

  /* @ngInject */
  function RouteConfig($stateProvider) {

    const VIEWS = {
      'main@': {
        templateUrl: 'app/+channels/channels.html',
        controller: 'ChannelsController',
        controllerAs: 'vm'
      }
    };

    const RESOLVER = {
      client: clientResolver,
      streamList: listResolver
    };

    $stateProvider
      .state({
        name: 'channels',
        url: '/channels',
        views: VIEWS,
        resolve: RESOLVER
      });
     
  }

  /* @ngInject */
  function listResolver($q, Deep) {
    let deferred = $q.defer();

    Deep
      .getClient()
      .then((client) => {
        let streams = client.record.getList('streams');

        streams.whenReady((list) => {
          deferred.resolve(list.getEntries());
        });
      });
    
    return deferred.promise;
  }

  /* @ngInject */
  function clientResolver(Deep) {
    return Deep.getClient();
  }
})();
