(function () {
  'use strict';

  angular
    .module('app.account')
    .controller('AccountController', Controller);

  /* @ngInject */
  function Controller($rootScope, $scope, Member, Channel, member) {
    var vm = this;

    vm.mode = 'info';
    let init = false;

    vm.changeMode = function(mode) {
      vm.mode = mode;
    };

    vm.member = member;

    $scope.$watch('vm.member.profileImage', (image, old) => {
      if (typeof image === 'string' && image !== old) {
        updateMember();
        console.log('bird', vm.member.profileImage);
      }
    });

    $scope.$watch('vm.member.player', (player, old) => {
      if (typeof player === 'string') {
        updateMember();
      }
    });

    $scope.$watch('vm.member.color', (color) => {
      if (color && init) {
        updateMember();
      } else if (color) {
        init = true;
      }
    });

    $scope.$watchCollection('vm.member.channel', (channel) => {
      if (channel && init) {
        
        Channel
          .prototype$patchAttributes(
            { id: vm.member.channel.id },
            vm.member.channel
          );
      }
    });

    function updateMember() {
      Member
        .prototype$patchAttributes(
          { id: vm.member.id },
          vm.member
        )
        .$promise
        .then(() => {
          $rootScope.$broadcast('loginEvent');
        });
    }
  }
})();
