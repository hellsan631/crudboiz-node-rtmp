;(function () {
  'use strict';

  angular
   .module('app.stream')
   .directive('streamMenu', streamMenu);

  /* @ngInject */
  function streamMenu() {
    return {
      restrict: 'E',
      template: `
        <div ng-if="dm.stream.active" class="view-count">
          <i class="material-icons">visibility</i> 
          <span class="viewer-count">
            {{ dm.stream.viewerCount }}
          </span>
        </div>

        <action-button
          ng-if="dm.stream.active && dm.member.username === dm.stream.name"
          button-style="primary-action btn-small live-alert"
          default-message="Live Alert"
          ng-click="dm.goLive()"
        >
        </action-button>

        <div class="switch">
          <label>
            <span class="hide-on-small-only">Flash</span>
            <input type="checkbox" ng-model="dm.html">
            <span class="lever"></span>
            <span class="hide-on-small-only">HTML5</span>
          </label>
        </div>
      `,
      scope: {},
      bindToController: {
        player: '=',
        stream: '<',
        member: '<'
      },
      controller: Controller,
      controllerAs: 'dm'
    };
  }

  /* @ngInject */
  function Controller($scope, $timeout, Widgets) {
    let dm = this;

    dm.goLive = () => {
      Widgets.liveAlert(dm.member.username);
    };

    console.log(dm.stream);

    let player = JSON.parse(JSON.stringify(dm.player || ''));
    
    dm.html = player === 'hls';

    $scope.$watch('dm.html', (html) => {
      if (typeof html !== 'undefined') {
        let temp = html ? 'hls' : 'rtmp';

        if (temp !== dm.player) {
          player = JSON.parse(JSON.stringify(temp));
          dm.player = temp;
        }
      }
    });

    $scope.$watch('dm.player', (watched) => {
      if (typeof watched !== 'undefined') {
        if (player !== dm.player) {
          player = JSON.parse(JSON.stringify(dm.player));

          dm.html = player === 'hls';
        }
      }
    });
  }
})();