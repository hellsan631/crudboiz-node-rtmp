(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('materialInput', materialInput);

  /* @ngInject */
  function materialInput() {
    const template = `
      <div input-field>
        <input
          id="{{ ::dm.name }}"
          name="{{ ::dm.name }}"
          type="{{ dm.type || 'text' }}"
          ng-minlength="dm.minLength"
          ng-maxlength="dm.maxLength"
          ng-required="dm.required"
          ng-disabled="dm.disabled"
          ng-model="dm.model"
          ng-class="dm.validate ? 'validate' : ''"
          autocomplete="{{dm.autocomplete}}"
        />
        <label for="{{ ::dm.name }}">{{ ::dm.label }}</label>
      </div>
    `;

    var directive = {
      restrict: 'E',
      template: template,
      scope: {},
      bindToController: {
        model: '=ngModel',
        name: '@',
        type: '@',
        label: '@',
        required: '=',
        pattern: '@',
        validate: '=',
        placeholder: '@',
        minLength: '@',
        maxLength: '@',
        disabled: '=',
        autocomplete: '@'
      },
      controller: function() {},
      controllerAs: 'dm',
      link: link
    };

    return directive;

    function link(scope, element) {
      var input = element.find('input')[0];

      if (typeof scope.dm.pattern === 'string') {
        input.pattern = scope.dm.pattern;
      }

      if (typeof scope.dm.placeholder === 'string') {
        input.placeholder = scope.dm.placeholder;
      }

      scope.$watch('dm.pattern', function(value) {
        if (typeof value === 'string') {
          input.pattern = value;
        }
      });

      scope.$watch('dm.placeholder', function(value) {
        if (typeof value === 'string') {
          input.placeholder = value;
        }
      });
    }
  }
})();
