(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('materialDate', materialDate);

  /* @ngInject */
  function materialDate() {
    const template = `
      <label for="{{ dm.name }}">{{ dm.label }}</label>
      <input input-date
        type="text"
        id="{{ dm.name }}"
        name="{{ dm.name }}"
        ng-model="dm.model"
        container="body"
        format="{{dm.format || 'mm/dd/yyyy'}}"
        months-full="{{ dm.month }}"
        months-short="{{ dm.monthShort }}"
        weekdays-full="{{ dm.weekdaysFull }}"
        weekdays-short="{{ dm.weekdaysShort }}"
        weekdays-letter="{{ dm.weekdaysLetter }}"
        select-years="1" />
    `;

    var directive = {
      restrict: 'E',
      template: template,
      scope: {},
      bindToController: {
        model: '=ngModel',
        name: '@',
        label: '@',
        format: '@'
      },
      controller: function() {},
      controllerAs: 'dm',
      link: link
    };

    return directive;

    function link(scope, element) {
      var dm = scope.dm;

      dm.month = [
        'January', 
        'February', 
        'March', 
        'April', 
        'May', 
        'June', 
        'July', 
        'August', 
        'September', 
        'October', 
        'November', 
        'December'
      ];

      dm.monthShort = [
        'Jan', 
        'Feb', 
        'Mar', 
        'Apr', 
        'May', 
        'Jun', 
        'Jul', 
        'Aug', 
        'Sep', 
        'Oct', 
        'Nov', 
        'Dec'
      ];

      dm.weekdaysFull = [
        'Sunday', 
        'Monday', 
        'Tuesday', 
        'Wednesday', 
        'Thursday', 
        'Friday', 
        'Saturday'
      ];

      dm.weekdaysLetter = [
        'S', 
        'M', 
        'T', 
        'W',
        'T', 
        'F', 
        'S'
      ];
    }
  }
})();