(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('ngPlaceholder', ngPlaceholder);

  /* @ngInject */
  function ngPlaceholder() {
    var directive = {
      restrict: 'A',
      scope: {
        placeholder: '=ngPlaceholder'
      },
      link: link
    };

    return directive;

    function link(scope, element) {
      var input = element.find('input');

      if (typeof scope.placeholder === 'string') {
        input.context.placeholder = scope.placeholder;
      }

      scope.$watch('placeholder', function(value) {
        if (typeof value === 'string') {
          input.context.placeholder = value;
        }
      });
    }
  }

})();
