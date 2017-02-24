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
        <a 
          data-activates="more-stream" 
          dropdown 
          data-hover="true"
          class="btn-floating btn-large waves-effect waves-light red"
        >
          <i class="material-icons">more_vert</i>
        </a>

        <ul id="more-stream" class="dropdown-content">
          <li ng-click="dm.player = 'rtmp'">
            <a>
              RTMP Player <i ng-show="dm.player === 'rtmp'" class="material-icons tiny">done</i> 
            </a>
          </li>
          <li ng-click="dm.player = 'hls'">
            <a> 
              HLS Player <i ng-show="dm.player === 'hls'" class="material-icons tiny">done</i>
            </a>
          </li>
        </ul>
      `,
      scope: {},
      bindToController: {
        player: '='
      },
      controller: Controller,
      controllerAs: 'dm'
    };
  }

  /* @ngInject */
  function Controller() {
    let dm = this;

  }
})();