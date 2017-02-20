;(function () {
  'use strict';

  angular
   .module('app.stream')
   .directive('backButton', backButton);

  /* @ngInject */
  function backButton() {
    return {
      restrict: 'E',
      template: `
        <div class="button-container">
          <div class="row">
            <div class="col s12">
              <a class="back" ui-sref="channels">
                <i class="material-icons">keyboard_backspace</i> Channels
              </a>
            </div>
          </div>
        </div>
      `,
      scope: {},
      bindToController: {
      },
      controller: Controller,
      controllerAs: 'dm'
    };
  }

  /* @ngInject */
  function Controller() {
    var dm = this;


  }
})();