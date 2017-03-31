;(function () {
  'use strict';

  angular
   .module('app.stream')
   .directive('crudRtmpPlayer', crudRtmpPlayer);

  /* @ngInject */
  function crudRtmpPlayer($timeout, Widgets, videojs) {
    return {
      restrict: 'E',
      template: `
        <div 
          ng-style="dm.shadowStyle"
          class="rtmp-container"
        >
          <video
            id="rtmp-player"
            class="video-js"
            controls
            preload="auto"
            poster="{{ ::dm.stream.poster }}"
          >
            <p class="vjs-no-js">
              To view this video please enable JavaScript, and consider upgrading to a
              web browser that
              <a href="http://videojs.com/html5-video-support/" target="_blank">
                supports HTML5 video
              </a>
            </p>
          </video>
        </div>
        
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

    function link(scope, element) {
      const ASPECT_RATIO = 9/16;

      let dm = scope.dm;

      let playerElement = element.find('#rtmp-player');
      let playerParent  = $('.player-area');

      resizePlayer();

      requestAnimationFrame(() => {
        $(window).on('window:resize', resizePlayer);

        $timeout(() => {
          if (scope.$on) {
            scope.$on('$destroy', function() {
              $(window).off('window:resize', resizePlayer);
            });
          }
        });
      });

      function resizePlayer() {
        let width = playerParent.innerWidth();
        let height = 2 * Math.round(width * ASPECT_RATIO/2);
        playerElement.attr('width', width);
        playerElement.attr('height', height);
        
        playerParent.css('height', height);
      }
    }
  }

  /* @ngInject */
  function Controller($scope, $rootScope, $timeout, $interval, videojs, Elements) {
    let dm = this;
    
    let timeout = 0;
    let streamPlayer;
    let init = false;

    let clearInterval = $interval(() => setBackgroundShadow(2000), 6000);

    if ($scope.$on) {
      $scope.$on('$destroy', function() {
        $interval.cancel(clearInterval);
        streamPlayer.dispose();
      });
    }

    $scope.$watch('dm.stream.poster', (poster) => {
      if (poster) {
        initPlayer();
      }
    });

    function initPlayer() {
      streamPlayer = videojs('rtmp-player', {
        techOrder: ['flash'],
        fluid: true,
        sources: [{
          src: dm.stream.rtmpUrl,
          type: 'rtmp/flv',
          label: 'Flash'
        }],
      }, function onPlayerReady() {
        this.play();

        init = true;
      });

      streamPlayer.on('ended', function() {
        this.dispose();
      });

      streamPlayer.on('error', function(e) {
        console.log(e);
      });   

      if (dm.stream.name !== dm.member.username) {
        streamPlayer
          .persistvolume({ namespace: 'crudboiz-rtmp-volume' });
      } else {
        streamPlayer.muted(true);
      }

      dm.streamPlayer = streamPlayer;
    }

    setBackgroundShadow();

    function setBackgroundShadow(timeout = 1000) {
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
})();
