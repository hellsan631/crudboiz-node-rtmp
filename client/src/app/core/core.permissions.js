(function() {
  'use strict';

  angular
    .module('app.core')
    .run(PermissionsConfig);

  /* @ngInject */
  function PermissionsConfig(PermPermissionStore, LoopBackAuth) {
    PermPermissionStore
      .definePermission(
        'isLoggedIn', 
        () => { return LoopBackAuth.currentUserId ? true : false; }
      );
  }

})();
