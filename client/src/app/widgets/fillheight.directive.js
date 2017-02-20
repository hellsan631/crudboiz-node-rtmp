(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('fillHeight', fillHeight);

  /* @ngInject */
  function fillHeight($window, $document, $timeout) {
    var directive = {
      restrict: 'A',
      scope: {
        debounceWait: '@'
      },
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      if (scope.debounceWait === 0) {
        angular.element($window).on('resize', windowResize);
      } else {
        // allow debounce wait time to be passed in.
        // if not passed in, default to a reasonable 250ms
        angular.element($window).on('resize', debounce(onWindowResize, scope.debounceWait || 250));
      }

      onWindowResize();

      // returns a fn that will trigger 'time' amount after it stops getting called.
      function debounce(fn, time) {
        var timeout;
        // every time this returned fn is called, it clears and re-sets the timeout
        return function () {
          var context = this;
          // set args so we can access it inside of inner function
          var args = arguments;
          var later = function () {
            timeout = null;
            fn.apply(context, args);
          };
          $timeout.cancel(timeout);
          timeout = $timeout(later, time);
        };
      }

      function onWindowResize() {
        var elementOffsetTop = element[0].offsetTop;
        var elementBottomMarginAndBorderHeight = getBottomMarginAndBorderHeight(element);

        var elementHeight = $window.innerHeight - elementOffsetTop - elementBottomMarginAndBorderHeight;
        element.css('min-height', elementHeight + 'px');
      }

      function getTopMarginAndBorderHeight(element) {
        var footerTopMarginHeight = getCssNumeric(element, 'margin-top');
        var footerTopBorderHeight = getCssNumeric(element, 'border-top-width');
        return footerTopMarginHeight + footerTopBorderHeight;
      }

      function getBottomMarginAndBorderHeight(element) {
        var footerBottomMarginHeight = getCssNumeric(element, 'margin-bottom');
        var footerBottomBorderHeight = getCssNumeric(element, 'border-bottom-width');
        return footerBottomMarginHeight + footerBottomBorderHeight;
      }

      function getCssNumeric(element, propertyName) {
        return parseInt(element.css(propertyName), 10) || 0;
      }
    }
  }

})();
