/* global Raven:false */

;(function() {
  'use strict';

  angular
    .module('app.channels')
    .controller('ChannelsController', Controller);

  /* @ngInject */
  function Controller($scope, $timeout, client, streamList, Deep) {
    let vm = this;

    var t0 = performance.now();
 
    let streams = client.record.getList('streams');

    let streamIds = [];
    let cleanup = [];

    vm.streamList = {};
    vm.liveList = (list, offline) => {
      let parsed = Deep.liveList(list, offline);

      vm.noneLive = parsed.noneLive;

      return parsed.result;
    };

    streamList.forEach(subscribeStream);

    cleanup.push(streams);

    streams.subscribe((list) => {
      list.forEach(subscribeStream);
    });

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

      client.record.snapshot(streamId, (err, data) => {
        vm.streamList[streamId] = data;

        var t1 = performance.now();
        console.log("Call took " + (t1 - t0) + " milliseconds.");
      });

      channel.whenReady(() => {
        $scope.$evalAsync(() => {

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
