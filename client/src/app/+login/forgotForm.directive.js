(function () {
  'use strict';

  angular
    .module('app.login')
    .directive('forgotForm', forgotForm);

  /* @ngInject */
  function forgotForm() {

    var directive = {
      restrict: 'E',
      template: `
        <form ng-submit="sm.submitEmail(sm.login)">
          <material-input
            name="email"
            label="Email"
            required="true"
            ng-model="sm.login.email">
          </material-input>

          <action-button
            button-style="primary-action btn-full"
            default-message="Reset Password"
            loading-state="sm.loading">
          </action-button>
        </form>
      `,
      scope: {},
      bindToController: {
        onForgotFailure: '&',
        onForgotSuccess: '&'
      },
      controller: Controller,
      controllerAs: 'sm'
    };

    return directive;
  }

  /* @ngInject */
  function Controller($timeout, Member) {
    var sm = this;

    sm.submitEmail = submitEmail;
    sm.loading = false;

    function submitEmail(login) {
      sm.loading = 'loading';

      Member
        .forgot(login)
        .then(function() {
          return loadingState('success');
        })
        .then(function(){
          sm.onForgotSuccess(sm.login);
        })
        .catch(function(error) {

          loadingState('error')
            .then(defaultLoadingState);

          sm.onForgotFailure({e: error});
        });
    }

    function defaultLoadingState() {
      return loadingState(false, 600);
    }

    function loadingState(state, time) {
      if(!time) time = 1200;

      return $timeout(function(){
        sm.loading = state;
      }, time);
    }

  }
})();
