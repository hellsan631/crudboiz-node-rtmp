;(function () {
  'use strict';

  angular
   .module('app.channels')
   .directive('channelCard', channelCard);

  /* @ngInject */
  function channelCard() {

    var directive = {
      restrict: 'E',
      template: `
        <div class="card" ui-sref="stream({ username: dm.stream.info.name })">
          <div class="card-image waves-effect waves-block waves-light">
            <img 
              class="poster hero" 
              hero-id="poster{{ ::dm.stream.info.name }}" 
              ng-src="{{ ::dm.poster }}"
            />
            <span class="card-title">
              {{ dm.stream.channel.title }}
              <span class="game">{{ dm.stream.channel.game }}</span>
            </span>
          </div>
          <div class="card-content" 
            ng-style="dm.cardStyle">
            {{ ::dm.stream.info.name }}

            <div ng-if="dm.stream.info.active" class="right">
              <i class="material-icons">visibility</i> 
              <span class="viewer-count">
                {{ dm.stream.info.viewerCount }}
              </span>
            </div>
          </div>
        </div>
      `,
      scope: {},
      bindToController: {
        stream: '<'
      },
      controller: Controller,
      controllerAs: 'dm'
    };

    return directive;
  }

  /* @ngInject */
  function Controller($scope, Elements, $interval) {
    var dm = this;

    if (dm.stream.channel && dm.stream.channel.color) {
      dm.cardStyle = {
        background: dm.stream.channel.color,
        color: Elements.textColor(dm.stream.channel.color)
      };
    }

    if (dm.stream.info.active) {
      dm.poster = `${dm.stream.info.poster}?${Math.floor(Date.now() / 1000)}`;
    } else {
      dm.poster = dm.stream.info.poster;
    }

    $scope.$watchCollection('dm.stream.channel', (channel) => {
      if (channel && channel.color) {
        dm.cardStyle = {
          background: dm.stream.channel.color,
          color: Elements.textColor(dm.stream.channel.color)
        };
      }
    });

  }
})();