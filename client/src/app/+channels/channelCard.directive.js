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
            <div 
              class="partner-logo hint--left"
              aria-label="Crudboiz Partner"
              ng-if="dm.stream.info.name === 'LNB'"
            >
              <img 
                src="images/lnb-partner-logo.png"
                alt="Crudboiz Partner"
              />
            </div>

            <span class="card-title">
              {{ ::dm.stream.info.name }}

              <div ng-if="dm.stream.info.active" class="right">
                <i class="material-icons">visibility</i> 
                <span class="viewer-count">
                  {{ dm.stream.info.viewerCount }}
                </span>
              </div>
            </span>
          </div>
        </div>
      `,
      scope: {},
      bindToController: {
        stream: '='
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

    $scope.$watch('dm.stream.info.lastOnline', (lastOnline) => {
      if (typeof lastOnline === 'string') {
        dm.stream.info.lastOnline = new Date(lastOnline);
      } else if (!lastOnline) {
        dm.stream.info.lastOnline = new Date('2015/12/12');
      }
    });

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