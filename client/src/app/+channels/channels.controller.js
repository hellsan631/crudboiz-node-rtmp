/* global Raven:false */

;(function() {
  'use strict';

  angular
    .module('app.channels')
    .controller('ChannelsController', Controller);

  /* @ngInject */
  function Controller($scope, $timeout, $localForage, Deep, client, streamList) {
    let vm = this;
 
    let streams = client.record.getList('streams');

    let streamIds = [];
    let cleanup = [];

    vm.streamList = streamList;
    
    vm.liveList = (list, offline = false) => {
      let parsed = Deep.liveList(list, offline);

      vm.noneLive = parsed.noneLive;

      return parsed.result;
    };

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

        $localForage.setItem('channelList', vm.streamList);
      });

      channel.whenReady(() => {
        $scope.$evalAsync(() => {

          cleanup.push(channel);

          channel
            .subscribe('info', function(value) {
              $scope.$evalAsync(() => {
                vm.streamList[streamId].info = value;

                $localForage.setItem('channelList', vm.streamList);
              });
            });
            
          channel
            .subscribe('channel', function(value) {
              $scope.$evalAsync(() => {
                vm.streamList[streamId].channel = value;

                $localForage.setItem('channelList', vm.streamList);
              });
            });
        });
      });
    }
  }
})();
