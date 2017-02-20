;(function() {
  'use strict';

  angular
    .module('app.channels')
    .config(RouteConfig);

  /* @ngInject */
  function RouteConfig($stateProvider) {

    $stateProvider
      .state({
        name: 'channels',
        url: '/channels',
        views: {
          'navbar@': {
            template: `<top-bar></top-bar>`,
            controller: function() {},
            controllerAs: 'vm'
          },
          'main@': {
            templateUrl: 'app/+channels/channels.html',
            controller: 'ChannelsController',
            controllerAs: 'vm'
          }
        }
      });
     
  }
})();
