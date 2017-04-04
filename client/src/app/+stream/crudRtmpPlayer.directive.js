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
        member: '<',
        player: '='
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

        scope.$evalAsync(() => {
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
  function Controller(
    $scope, 
    $rootScope, 
    $timeout, 
    $interval, 
    videojs, 
    Offline, 
    Elements,
    Dialog
  ) {
    let dm = this;
    
    let timeout = 0;
    
    let init = false;
    let source = {
      src: dm.stream.rtmpUrl,
      type: 'rtmp/flv',
      label: 'Flash'
    };
    let streamPlayer;
    let onlineState = Offline.state;

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
        sources: [source],
      });

      initEvents(streamPlayer); 

      if (!dm.member || dm.stream.name !== dm.member.username) {
        streamPlayer
          .persistvolume({ namespace: 'crudboiz-rtmp-volume' });
      } else {
        streamPlayer.muted(true);
      }
    }

    function initEvents(player) {
      player.on('ready', function() {
        this.play();
      });

      player.on('ended', function() {
        this.dispose();
      });

      player.on('error', function(e) {
        console.log(e);

        if (e.code === 4) {
          Dialog
            .confirm(
              'Switch to HLS Player?',
              `
                It looks like flash isn't supported in your browser.
                <small>If you'd like to continue with flash, consider switching browsers to Firefox or Microsoft Edge.</small>
              `
            )
            .then((confirm) => {
              if (!confirm) return;

              $scope.$evalAsync(() => dm.player = 'hls');
            });
        }
      });
     
      player.on('playing', function() {
        init = true;
      });

      Offline.on('down', () => {
        onlineState = 'down';
        player.pause();
      });

      Offline.on('up', () => {
        onlineState = 'up';
        
        player.src(source);
        player.load();

        setTimeout(() => {
          player.play();
        }, 3000);
      });
    }

    setBackgroundShadow();

    function setBackgroundShadow(timeout = 1000) {
      Elements
        .delightfulShadow(dm.stream.poster)
        .then((shadow) => {
          setTimeout(() => {
            $scope.$evalAsync(() => {
              dm.shadowStyle = {
                'box-shadow': shadow
              };
            });
          }, timeout);

          if (onlineState === 'down') {
            Offline.trigger('up');
          }
        })
        .catch(() => {
          if (onlineState === 'up') {
            Offline.trigger('down');
          }
        });
    }

  }
})();
