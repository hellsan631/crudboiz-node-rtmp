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
  function listResolver($q, $localForage, Deep) {
    let deferred = $q.defer();
    let streamList = {};
    let promises = [];

    $localForage
      .getItem('channelList')
      .then((list) => {
        if (list) return deferred.resolve(list);

        runDeep();
      });

    function runDeep() {
      Deep
        .getClient()
        .then((client) => {
          let streams = client.record.getList('streams');

          streams.whenReady((list) => {
            let enteries = list.getEntries();

            enteries.forEach((streamId) => {
              promises.push(addPromise(streamId));
            });

            Promise
              .all(promises)
              .then(() => {
                $localForage.setItem('channelList', streamList);

                deferred.resolve(streamList);
              });
          });

          function addPromise(streamId) {
            return new Promise(function(resolve) {
              client.record.snapshot(streamId, (err, data) => {
                streamList[streamId] = data;

                resolve(data);
              });
            });
          }
        });
    }

    
    
    return deferred.promise;
  }

  /* @ngInject */
  function clientResolver(Deep) {
    return Deep.getClient();
  }
})();
