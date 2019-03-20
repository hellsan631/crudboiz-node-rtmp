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
      streamList: listResolver,
      member: getMember,
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
  
   /* @ngInject */
  function getMember($q, Widgets, Member) {
    var deferred = $q.defer();

    Widgets
      .currentMember()
      .then(deferred.resolve)
      .catch(deferred.reject);

    return deferred.promise;
  }

})();
