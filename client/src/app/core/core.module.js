;(function() {
  'use strict';

  angular
    .module('app.core', [
      /* Angular Modules */
      'ngAnimate',
      'ngSanitize',
      'ngTouch',
      /* Cross-app Modules */
      'blocks.logger',
      /* Router Modules */
      'ui.router',
      'permission',
      'permission.ui',
      'anim-in-out',
      /* 3rd Party Modules */
      'LocalForageModule',
      'ui.materialize',
      'lbServices',
      'alAngularHero'
    ]);

})();
