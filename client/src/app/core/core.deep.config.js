;(function () {
  'use strict';

  angular
   .module('app.core')
   .run(config);

  /* @ngInject */
  function config($localForage, Deep) {

    $localForage
      .getItem('uuid')
      .then((uuid) => {
        if (!uuid) {
          $localForage.setItem('uuid', Deep.uuid());
        }
      });
   
  }
})();

