(function() {
'use strict';

  angular
    .module('app.signup')
    .controller('SignupController', Controller);

  /* @ngInject */
  function Controller($rootScope, $state, Dialog, Member, $timeout) {
    let vm = this;
    
    vm.interfaceClass = 'signup-form col s12';
    vm.pwtype = 'password';
    vm.loading = false;

    vm.signup = signup;

    vm.switchType = () => {
      if (vm.pwtype === 'password')
        vm.pwtype = 'text';
      else 
        vm.pwtype = 'password';
    };

    function signup() {
      vm.loading = true;

      Member
        .create(vm.member)
        .$promise
        .then(function(res) {
          return Dialog.success('Signed Up', 'Successfully signed up!');
        })
        .then(function(res) {
          vm.loading = 'success';

          const credentials = {
            email: vm.member.email,
            password: vm.member.password
          };

          return Member.login(credentials).$promise;
        })
        .then(() => {
          vm.loading = false;
          vm.member = {};

          $rootScope.$broadcast('loginEvent');

          $state.go('channels');
        })
        .catch((err) => {
          $timeout(() => {
            vm.loading = false;
          }, 1000);

          return Dialog.genericError(err);
        });
    }
  }
})();