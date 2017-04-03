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

        <div class="switch">
          <label>
            Flash
            <input type="checkbox" ng-model="dm.html">
            <span class="lever"></span>
            HTML5
          </label>
        </div>
      `,
      scope: {},
      bindToController: {
        player: '=',
        stream: '<'
      },
      controller: Controller,
      controllerAs: 'dm'
    };
  }

  /* @ngInject */
  function Controller($scope) {
    let dm = this;
    
    dm.html = dm.player === 'hls';

    $scope.$watch('dm.html', (html) => {
      if (typeof html !== 'undefined') {
        let player = html ? 'hls' : 'rtmp';

        if (player !== dm.player) {
          dm.player = player;
        }
      }
    });
  }
})();