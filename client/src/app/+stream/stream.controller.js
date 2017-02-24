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
    Widgets
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
