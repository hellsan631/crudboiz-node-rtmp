(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('materialSelect', materialSelect);

  /* @ngInject */
  function materialSelect() {
    const template = `
      <div input-field>
        <select ng-model="dm.model" material-select watch
          ng-options="option for option in dm.options">
        </select>
        <label class="select">{{ ::dm.label }}</label>
      </div>
    `;

    var directive = {
      restrict: 'E',
      template: template,
      scope: {},
      bindToController: {
        model: '=ngModel',
        label: '@',
        options: '='
      },
      controller: function() {},
      controllerAs: 'dm'
    };

    return directive; 
  }
})();