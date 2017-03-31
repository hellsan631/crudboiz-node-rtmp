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
    member, 
    stream,
    previous,
    host, 
    Deep,
    Widgets,
    Offline,
    Dialog
  ) {
    let vm = this;
    let client = Deep.getClient();

    vm.stream = stream;
    vm.member = member;
    vm.host   = host;
    vm.host.profileImage = Widgets.getProfileImage(vm.host);

    let record = client.record.getRecord(`streams/${$stateParams.username}`);

    record.subscribe('info', (value) => {
      $scope.$evalAsync(() => vm.stream = value);
    });

    record.subscribe('channel', (value) => {
      $scope.$evalAsync(() => vm.channel = value);
    });

    vm.selectedPlayer = member.player || 'rtmp';

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

    $localForage
      .getItem('selectedPlayer')
      .then((player) => {
        if (player) vm.selectedPlayer = player;

        watchPlayer();
      });

    $timeout(() => {

      //we time this out to give our hero animation time to finish
      vm.streamInit = true;
    }, previous.url ? 800 : 100);

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
