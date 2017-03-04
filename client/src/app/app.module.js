;(function() {
  'use strict';

  angular
    .module('app', [
      /* Shared Modules */
      'app.core',
      'app.widgets',
      /* Content Modules */
      'app.channels',
      'app.stream',
      'app.login',
      'app.signup',
      'app.account',
      'app.guide'
    ]);

})();
