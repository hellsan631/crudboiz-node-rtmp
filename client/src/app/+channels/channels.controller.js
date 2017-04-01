/* global Raven:false */

;(function() {
  'use strict';

  angular
    .module('app.channels')
    .controller('ChannelsController', Controller);

  /* @ngInject */
  function Controller($scope, $timeout, Deep) {
    let vm = this;

    let client = Deep.getClient();
    let streamIds = [];
    let cleanup = [];

    vm.streamList = {};
    vm.liveList = liveList;

    let streams = client.record.getList('streams');

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

    function liveList(list, offline = false) {
      var result = {};
      let foundLive = false;

      angular.forEach(list, (stream, key) => {
        if (!stream.info) return;

        if (stream.info.active && !offline) {
          result[key] = stream;
          foundLive = true;
        } else if (!stream.info.active && offline) {
          result[key] = stream;
        }
      });

      if (!foundLive && !offline) {
        vm.noneLive = true;
      } else if (foundLive && !offline){
        vm.noneLive = false;
      }
      
      return result;
    }
    
  }
})();
