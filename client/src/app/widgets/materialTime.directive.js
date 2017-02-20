(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('materialTime', materialTime);

  /* @ngInject */
  function materialTime() {
    const template = `
      <material-select
        ng-model="dm.model"
        label="{{ ::dm.label }}"
        options="dm.timeOptions">
      </material-select>
    `;

    var directive = {
      restrict: 'E',
      template: template,
      scope: {},
      bindToController: {
        model: '=ngModel',
        label: '@'
      },
      controller: function() {},
      controllerAs: 'dm',
      link: link
    };

    return directive;

    function link(scope, element) {
      var dm = scope.dm;

      dm.timeOptions = [];

      var timeStart = 7;
      var timeSelection = 'AM';
      var timeIncrement = '30';

      while (timeStart <= 12) {
        if (timeStart === 12) {
          timeSelection = 'PM';
        }

        addTime();
      }

      timeStart = 1;
      timeSelection = 'PM';

      while (timeStart <= 11) {
        addTime();
      }

      function addTime() {
        var time = timeStart + '';

        if (time.length === 1) {
          time = '0' + time;
        }

        dm.timeOptions.push(time + ':00 ' + timeSelection);
        dm.timeOptions.push(time + ':' + timeIncrement + ' ' + timeSelection);

        timeStart++;
      }
    }
  }
})();