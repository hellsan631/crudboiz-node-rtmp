(function() {
  'use strict';

  angular
    .module('app.core')
    .run(PermissionsConfig);

  /* @ngInject */
  function PermissionsConfig(PermPermissionStore, LoopBackAuth, $localForage, Member) {
    PermPermissionStore
      .definePermission(
        'isLoggedIn', 
        () => { 
          return new Promise((resolve, reject) => {
            Member
              .getCurrent()
              .$promise
              .then((member) => {
                return $localForage.setItem('currentMember', member);
              })
              .then(resolve)
              .catch(() => {
                $localForage
                  .removeItem('currentMember')
                  .then(reject);
              });
            
          }); 
        }
      );
  }

})();
