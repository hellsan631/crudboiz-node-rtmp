;(function() {
  'use strict';

  angular
      .module('blocks.logger')
      .factory('logger', logger);

  /* @ngInject */
  function logger($log, Materialize) {
    var service = {
      showToasts: true,
      showErrors: false,

      error   : error,
      info    : info,
      success : success,
      warning : warning,

      // straight to console; bypass toast
      log     : $log.log
    };

    return service;
    /////////////////////

    function error(message, data, length = 4000) {
      if(typeof message === 'object'){
        message = message.statusText || 'An error has occured';
      }

      if (service.showToasts && service.showErrors) {
        Materialize.toast(message, length, 'error');
      }

      $log.error('Error: ' + message, data);
    }

    function info(message, data, length = 4000) {
      if (service.showToasts) {
        Materialize.toast(message, length, 'info');
      }

      $log.info('Info: ' + message, data);
    }

    function success(message, data, length = 4000) {
      if (service.showToasts) {
        Materialize.toast(message, length, 'success');
      }

      $log.info('Success: ' + message, data);
    }

    function warning(message, data, length = 4000) {
      if (service.showToasts) {
        Materialize.toast(message, length, 'warning');
      }

      $log.warn('Warning: ' + message, data);
    }
  }
}());
