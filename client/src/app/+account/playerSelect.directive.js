;(function () {
  'use strict';

  angular
   .module('app.account')
   .directive('playerSelect', playerSelect);

  /* @ngInject */
  function playerSelect() {
    return {
      restrict: 'E',
      template: `
        <div class="card-panel big-shadow white">
          <div class="row">
            <div class="col s12 center-align">
              <h4>Player Select</h4>
            </div>
          </div>
          <div class="row">
            <div class="col s4">
              <input 
                class="with-gap" 
                ng-model="dm.member.player" 
                value="rtmp" 
                name="players"
                type="radio"
                id="rtmp"
              />
              <label for="rtmp">RTMP<br/><small>(flash, lowest latency)</small></label>
            </div>
            <div class="col s4">
              <input 
                class="with-gap" 
                ng-model="dm.member.player" 
                value="hls" 
                name="players"
                type="radio"
                id="hls"
              />
              <label for="hls">HLS<br/><small>(html5, high latency)</small></label>
            </div>
            <div class="col s4">
              <input 
                class="with-gap" 
                ng-model="dm.member.player" 
                value="dash" 
                name="players"
                type="radio"
                id="dash"
                disabled="disabled"
              />
              <label for="dash">Dash<br/><small>(html5, lower latency)</small></label>
            </div>
          </div>
        </div>
      `,
      scope: {},
      bindToController: {
        member: '='
      },
      controller: Controller,
      controllerAs: 'dm'
    };
  }

  /* @ngInject */
  function Controller($scope, $localForage) {
    let dm = this;

    $scope.$watch('dm.member.player', (player) => {
      if (player) {
        $localForage.setItem('selectedPlayer', player);
      }
    });

  }
})();