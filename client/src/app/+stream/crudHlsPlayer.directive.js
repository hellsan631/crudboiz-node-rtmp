;(function () {
  'use strict';

  angular
   .module('app.stream')
   .directive('crudHlsPlayer', crudHlsPlayer);

  /* @ngInject */
  function crudHlsPlayer(Elements, $interval, $timeout) {

    var directive = {
      restrict: 'E',
      template: `
        <div class="crud-player" ng-style="dm.shadowStyle"></div>
      `,
      scope: {},
      bindToController: {
        stream: '<',
        member: '<'
      },
      controller: Controller,
      controllerAs: 'dm',
      link: link
    };

    return directive;

    function link(scope, element) {
      let dm = scope.dm;

      let clearInterval = $interval(() => setBackgroundShadow(10000), 6000);

      if (scope.$on) {
        scope.$on('$destroy', function() {
          $interval.cancel(clearInterval);
        });
      }

      setBackgroundShadow();

      function setBackgroundShadow(timeout) {
        Elements
          .delightfulShadow(dm.stream.poster)
          .then((shadow) => {
            $timeout(() => {
              dm.shadowStyle = {
                'box-shadow': shadow
              };
            }, timeout);
          });
      }
    }
  }

  /* @ngInject */
  function Controller($scope, $timeout, Widgets, Clappr) {
    let dm = this;

    const ASPECT_RATIO = 9/16;

    let playerElement = $('.crud-player')[0];
    let playerParent  = $('.player-area');
    let player;

    dm.playerLoaded = false;

    player = new Clappr.Player({
      source: dm.stream.hlsUrl,
      poster: Widgets.getFreshUrl(dm.stream.poster),
      autoPlay: false,
      width: '100%'
    });

    player.on(Clappr.Events.PLAYER_PLAY, function() {
      $scope.$evalAsync(() => dm.playerLoaded = true);

      if (dm.stream.name === dm.member.username) {
        player.mute();
      }
    });

    player.attachTo(playerElement);

    setTimeout(() => player.play(), 3000);
    
    setTimeout(() => resizePlayer(), 200);
    
    $(window).on('window:resize', resizePlayer);

    if ($scope.$on) {
      $scope.$on('$destroy', function() {
        $(window).off('window:resize', resizePlayer);
      });
    }

    function resizePlayer() {
      let width = playerParent.innerWidth();
      let height = 2 * Math.round(width * ASPECT_RATIO/2);

      player.resize({ 
        width: width, 
        height: height 
      });
      
      playerParent.css('height', height);
    }

  }
})();