/* global Raven:false */

;(function() {
  'use strict';

  angular
    .module('app.team')
    .controller('TeamController', TeamController);

  /* @ngInject */
  function TeamController($scope, $timeout, $localForage, client, Deep) {
    let vm = this;

    let streamIds = [];
    let cleanup = [];

    vm.streamList = {};
    vm.liveList = (list) => {
      let parsed = Deep.liveList(list);

      vm.noneLive = parsed.noneLive;

      return parsed.result;
    };

    $localForage
      .getItem('selectedPlayer')
      .then((player) => {
        if (player) vm.selectedPlayer = player || 'rtmp';
      });

    let streams = client.record.getList('streams');

    cleanup.push(streams);

    streams.subscribe((list) => {
      list.forEach(subscribeStream);
    });

    //@HACK We need to wait for rest of the stream list to sync up
    $timeout(() => {
      vm.tempList = vm.liveList(vm.streamList);
    }, 100);

    if ($scope.$on) {
      $scope.$on('$destroy', function() {
        cleanup.forEach((item) => {
          item.unsubscribe(() => { 
            item.discard();
          });
        });

        setTimeout(() => {
          client.close();
        }, 50);
      });
    }

    function subscribeStream(streamId) {
      if (streamIds.includes(streamId))
        return;
      else
        streamIds.push(streamId);

      let channel = client.record.getRecord(streamId);

      channel.whenReady(() => {
        $scope.$evalAsync(() => {
          vm.streamList[streamId] = channel.get();

          cleanup.push(channel);

          channel
            .subscribe('info', function(value) {
              $scope.$evalAsync(() => {
                vm.streamList[streamId].info = value;
              });
            });
            
          channel
            .subscribe('channel', function(value) {
              $scope.$evalAsync(() => {
                vm.streamList[streamId].channel = value;
              });
            });
        });
      });
    }
    
  }
    
})();
