(function () {
  'use strict';

  angular
    .module('app.login')
    .directive('loginForm', loginForm);

  /* @ngInject */
  function loginForm() {
    return {
      restrict: 'E',
      template: `
        <form name="login" ng-submit="sm.submitLogin(sm.login)">
          <material-input
            name="email"
            label="Email"
            type="email"
            required="true"
            validate="true"
            ng-model="sm.login.email">
          </material-input>
          <material-input
            name="password"
            label="Password"
            type="password"
            required="true"
            ng-model="sm.login.password">
          </material-input>

          <action-button
            button-style="primary-action btn-full"
            default-message="LOG IN"
            loading-state="sm.loading">
          </action-button>
        </form>
      `,
      scope: {},
      bindToController: {
        onLoginFailure: '&',
        onLoginSuccess: '&'
      },
      controller: Controller,
      controllerAs: 'sm'
    };
  }

  /* @ngInject */
  function Controller($timeout, $stateParams, Member) {
    var sm = this;

    sm.submitLogin = submitLogin;
    sm.loading = false;

    if ($stateParams.email) {
      sm.login = {
        email: $stateParams.email.replace(/\s/g, '+')
      };
    }

    function submitLogin(login) {
      sm.loading = 'loading';

      var user = null;

      Member
        .login(login)
        .$promise
        .then(function (res) {
          user = res || {};

          return loadingState('success', 600);
        })
        .then(function() {
          sm.onLoginSuccess({user: user});
        })
        .catch(function(error) {

          loadingState('error')
            .then(defaultLoadingState);

          sm.onLoginFailure({e: error});
        });
    }

    function defaultLoadingState() {
      return loadingState(false, 1200);
    }

    function loadingState(state, time) {
      if(!time) time = 300;

      return $timeout(function(){
        sm.loading = state;
      }, time);
    }

  }
})();