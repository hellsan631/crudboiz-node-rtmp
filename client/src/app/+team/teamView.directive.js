;(function () {
  'use strict';

  angular
   .module('app.team')
   .directive('teamView', teamView);

  /* @ngInject */
  function teamView() {
    return {
      restrict: 'E',
      template: `
        <div class="player-area">
          <hero-background
            ng-if="!dm.streamInit"
            class="animate-fade"
            stream="dm.stream.info"
          >
          </hero-background>
          <crud-hls-player
            ng-if="dm.selectedPlayer === 'hls'"
            stream="dm.stream.info"
          >
          </crud-hls-player>
          <crud-rtmp-player
            ng-if="dm.selectedPlayer === 'rtmp'"
            stream="dm.stream.info"
          >
          </crud-rtmp-player>
        </div>
      `,
      scope: {},
      bindToController: {
        stream: '<',
        selectedPlayer: '<'
      },
      controller: Controller,
      controllerAs: 'dm'
    };
  }

  /* @ngInject */
  function Controller($timeout) {
    let dm = this;

    $timeout(() => {
      dm.streamInit = true;
    }, 400);

  }
})();