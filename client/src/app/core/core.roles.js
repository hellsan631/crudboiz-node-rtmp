(function() {
  'use strict';

  angular
    .module('app.core')
    .run(RoleConfig);

  /* @ngInject */
  function RoleConfig(PermRoleStore) {
    PermRoleStore.defineRole('MEMBER', ['isLoggedIn']);
  }

})();
