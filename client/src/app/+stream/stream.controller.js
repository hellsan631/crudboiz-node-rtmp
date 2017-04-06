/* global Raven:false */

;(function() {
  'use strict';

  angular
    .module('app.stream')
    .controller('StreamController', Controller);

  /* @ngInject */
  function Controller(
    $scope, 
    $stateParams,
    $localForage, 
    $timeout,
    client,
    member,
    stream,
    previous,
    host,
    Widgets,
    Offline,
    Dialog
  ) {
    let vm = this;

    let record = client.record.getRecord(`streams/${$stateParams.username}`);

    vm.stream = stream;
    vm.member = member;
    vm.host   = host;
    vm.host.profileImage = Widgets.getProfileImage(vm.host);

    $localForage
      .getItem('selectedPlayer')
      .then((player) => {
        if (player) {
          vm.selectedPlayer = player;
        } else {
          vm.selectedPlayer = member.player;
        }

        vm.selectedPlayer = vm.selectedPlayer || 'rtmp';

        watchPlayer();
      });

    record.subscribe('info', (value) => {
      $scope.$evalAsync(() => vm.stream = value);
    });

    record.subscribe('channel', (value) => {
      $scope.$evalAsync(() => vm.channel = value);
    });

    // Handles our offline player check
    Offline.on('down', () => {
      if (vm.selectedPlayer !== 'rtmp') return;

      $localForage
        .getItem('offlinePopup')
        .then((res) => {
          if (res) return;

          $localForage.setItem('offlinePopup', true);

          Dialog
            .confirm(
              'Switch to HLS Player?',
              'There seems to be a problem with your internet connection, do you want to switch to the more stable HLS player when you reconnect?'
            )
            .then((confirm) => {
              if (!confirm) return;

              Offline.on('up', () => {
                $scope.$evalAsync(() => vm.selectedPlayer = 'hls');
              });
            });
        });
    });

    $timeout(() => {

      //we time this out to give our hero animation time to finish
      vm.streamInit = true;
    }, previous.url ? 800 : 50);

    if ($scope.$on) {
      $scope.$on('$destroy', function() {
        record.unsubscribe(() => record.discard());
        
        setTimeout(() => client.close(), 50);
      });
    }

    function watchPlayer() {
      $scope.$watch('vm.selectedPlayer', (player) => {
        if (player) {
          $localForage.setItem('selectedPlayer', player);
        }
      });
    }
  }
})();
