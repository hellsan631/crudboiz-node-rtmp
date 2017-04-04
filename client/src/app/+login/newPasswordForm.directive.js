(function () {
  'use strict';

  angular
    .module('app.login')
    .directive('newPasswordForm', newPasswordForm);

  /* @ngInject */
  function newPasswordForm() {
    return {
      restrict: 'E',
      template: `
        <form ng-submit="sm.submitReset(sm.reset)">
          <material-input
            name="password"
            label="New Password"
            type="password"
            pattern=".{8,}"
            validate="true"
            required="true"
            ng-model="sm.reset.password">
          </material-input>
          
          <material-input
            name="password"
            label="Confirm Password"
            type="password"
            pattern=".{8,}"
            validate="true"
            required="true"
            ng-model="sm.reset.confirm">
          </material-input>

          <action-button
            button-style="primary-action btn-full"
            default-message="Update"
            loading-state="sm.loading">
          </action-button>
        </form>
      `,
      scope: {},
      bindToController: {
        onResetFailure: '&',
        onResetSuccess: '&'
      },
      controller: Controller,
      controllerAs: 'sm'
    };
  }

  /* @ngInject */
  function Controller($timeout, $state, $stateParams, User) {
    var sm = this;

    sm.submitReset = submitReset;
    sm.loading = false;

    sm.reset = {
      email: $stateParams.email.replace(/\s/g, '+'),
      token: $stateParams.token
    };

    function submitReset(reset) {
      sm.loading = 'loading';

      if(sm.reset.password !== sm.reset.confirm) {
        loadingState('error')
          .then(defaultLoadingState);

        return sm.onResetFailure({
          e: 'Passwords do not match'
        });
      }

      User
        .reset(reset)
        .then(function(){
          return loadingState('success');
        })
        .then(sm.onResetSuccess)
        .catch(function(error) {

          loadingState('error')
            .then(defaultLoadingState);

          if (error.status === 403) {
            $state.go('login', null, {reload: true, inherit: false});
          }

          sm.onResetFailure({e: error});
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
