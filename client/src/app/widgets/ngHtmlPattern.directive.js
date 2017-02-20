(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('ngHtmlPattern', ngHtmlPattern);

  /* @ngInject */
  function ngHtmlPattern() {
    var directive = {
      restrict: 'A',
      scope: {
        pattern: '=ngHtmlPattern'
      },
      link: link
    };

    return directive;

    function link(scope, element) {
      var input = element.find('input');

      if (typeof scope.pattern === 'string') {
        input.context.pattern = scope.pattern;
      }

      scope.$watch('pattern', function(value) {
        if (typeof value === 'string') {
          input.context.pattern = value;
        }
      });
    }
  }

})();
