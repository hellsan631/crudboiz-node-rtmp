;(function() {
  'use strict';

  angular
    .module('app.login')
    .controller('LoginController', LoginController);

  /* @ngInject */
  function LoginController($rootScope, $timeout, $state, $stateParams, Dialog) {
    var vm = this;

    vm.mode = $stateParams.token && $stateParams.email ? 'new' : 'login';
    vm.toggleModes = toggleModes;

    vm.loginFormClass = 'login-form col s12 m8 l8 xl6 offset-m2 offset-l2 offset-xl3';

    vm.loginSuccess = loginSuccess;
    vm.loginFailure = loginFailure;

    vm.forgotSuccess = forgotSuccess;
    vm.forgotFailure = genericErrorDialog;

    vm.resetSuccess = resetSuccess;
    vm.resetFailure = genericErrorDialog;

    function toggleModes() {
      if(vm.mode === 'login') {
        if ($stateParams.token && $stateParams.email) {
          vm.mode = 'new';
        } else {
          vm.mode = 'forgot';
        }
      } else {
        vm.mode = 'login';
      }
    }

    function loginSuccess(user) {
      $rootScope.$broadcast('loginEvent');
      $state.go('channels');
    }

    function loginFailure(err) {
      genericErrorDialog(err, 'Login Failed');
    }

    function forgotSuccess(email) {
      Dialog.success(
        'Email Sent',
        'We\'ve sent an email to ' + email.replace(/\s/g, '+') +
        ' with instructions on how to reset your password'
      );
    }

    function resetSuccess() {
      var email = JSON.parse(JSON.stringify($stateParams.email.replace(/\s/g, '+')));
      var params = {
        email: email,
        token: null
      };

      Dialog.success(
        'Success!',
        'We\'ve successfully changed the password for ' + email +
        '. You may now login with your new password.'
      );

      $state.go('login', params, {reload: true, inherit: false});
    }

    function genericErrorDialog(err, title) {
      var message;

      if (typeof err === 'object') {
        if (err.data) {
          err = err.data;
        } 
        if (err.error) {
          err = err.error;
        }

        message = err.message || err.msg;
      } else if (typeof err === 'string') {
        message = err;
      }

      Dialog.error(title || 'Uh oh', message);

      if (typeof err === 'string')
        throw new Error(err);
      else
        throw err;
    }
  }
})();