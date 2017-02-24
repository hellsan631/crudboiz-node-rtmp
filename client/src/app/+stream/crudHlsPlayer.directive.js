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
        stream: '<'
      },
      controller: Controller,
      controllerAs: 'dm',
      link: link
    };

    return directive;

    function link(scope, element) {
      let dm = scope.dm;

      let clearInterval = $interval(() => setBackgroundShadow(10000), 8000);

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

    $timeout(() => initPlayer(), 2000);

    function initPlayer() {
      player = new Clappr.Player({
        source: dm.stream.hlsUrl,
        poster: Widgets.getFreshUrl(dm.stream.poster),
        autoPlay: true,
        width: '100%'
      });

      player.on(Clappr.Events.PLAYER_PLAY, function() {
        $timeout(() => {
          dm.playerLoaded = true;
        }, 300);
      });

      player.attachTo(playerElement);

      resizePlayer();
      
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

  }
})();