(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('actionButton', actionButton);

  /* @ngInject */
  function actionButton() {
    return {
      restrict: 'E',
      template: `
        <button type="{{ dm.type || 'submit' }}"
          ng-class="dm.buttonStyle"
          ng-disabled="dm.loadingState || dm.disabled"
          class="btn btn-flat">
          <span ng-if="!dm.loadingState">{{ dm.defaultMessage }}</span>

          <div ng-if="dm.loadingState === 'loading' || dm.loadingState === true" 
            class="preloader-svg-wrapper animate-bounce">
            <div class="preloader-wrapper small active">
              <div class="spinner-layer spinner-yellow-only">
                <div class="circle-clipper left">
                  <div class="circle"></div>
                </div><div class="gap-patch">
                  <div class="circle"></div>
                </div><div class="circle-clipper right">
                  <div class="circle"></div>
                </div>
              </div>
            </div>
          </div>

          <span ng-if="dm.loadingState === 'error'">
            {{ dm.errorMessage || 'Error' }}
          </span>

          <span ng-if="dm.loadingState === 'success'">
            {{ dm.successMessage || 'Success!' }}
          </span>
        </button>
      `,
      scope: {},
      bindToController: {
        buttonStyle: '@',
        defaultMessage: '@',
        loadingState: '=',
        loaderAnimation: '@',
        errorMessage: '@', 
        successMessage: '@',
        disabled: '=ngDisabled',
        type: '@'
      },
      controller: Controller,
      controllerAs: 'dm'
    };
  }

  /* @ngInject */
  function Controller($scope) {
    var dm = this;

    if (!dm.style) dm.style = 'primary-action';     
    
  }
})();