;(function () {
  'use strict';

  angular
   .module('app.stream')
   .directive('heroBackground', heroBackground);

  /* @ngInject */
  function heroBackground($window, $timeout) {

    var directive = {
      restrict: 'E',
      template: `
        <div
          hero-id="poster{{ ::dm.stream.name }}"
          class="poster hero hero-container"
        >
          <div class="not-live animate-fade" ng-if="!dm.stream.active">
            Stream Is Not Live
          </div>
          <img
            ng-src="{{ ::dm.stream.poster }}"
            class="responsive-img"
          />
        </div>
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
      const ASPECT_RATIO = 9/16;

      let dm = scope.dm;

      let background = $(element.find('.hero-container')[0]);
      let heroArea = $('.player-area');

      resize();
      
      $(window).on('window:resize', resize);

      if (scope.$on) {
        scope.$on('$destroy', function() {
          $(window).off('window:resize', resize);
        });
      }

      setTimeout(() => {
        element.addClass('init');
      }, 400);

      function resize() {
        let height = 2 * Math.round(element.innerWidth() * ASPECT_RATIO/2);

        background.css({
          width: element.innerWidth(),
          height: height
        });
        
        element.css('height', height);
        heroArea.css('height', height);
      }
    }
  }

  /* @ngInject */
  function Controller(Widgets) {
    var dm = this;

  }
})();