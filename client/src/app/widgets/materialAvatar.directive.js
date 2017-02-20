(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('materialAvatar', avatar);

  /* @ngInject */
  function avatar(MaterialAvatar) {
    var directive = {
      restrict: 'A',
      scope: {
        options: '='
      },
      link: link
    };

    return directive;

    function link(scope, element) {
      var avatarElement = new MaterialAvatar(element, {});

      scope.$watch('options', function(options) {
        if (options) {
          avatarElement.updateOptions(options);
        }
      });
    }
  }

})();