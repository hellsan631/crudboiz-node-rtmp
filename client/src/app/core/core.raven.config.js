;(function () {
  'use strict';

  angular
   .module('app.core')
   .run(config);

  /* @ngInject */
  function config(Raven) {

    let interval = setInterval(() => {
      if (bindRavenLogger())
        clearInterval(interval);
    }, 32);

    function bindRavenLogger() {
      if (window.location.hostname === 'localhost')
        return true;
        
      if (!Raven || !Raven.Plugins)
        return false;

      Raven
        .config('https://4e4c42cb136d42928a7702138430a3f5@sentry.io/131405')
        .addPlugin(Raven.Plugins.Angular)
        .install();

      return true;
    }
   
  }
})();

