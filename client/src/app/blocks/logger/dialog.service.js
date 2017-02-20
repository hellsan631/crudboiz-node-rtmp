;(function() {
  'use strict';

  angular
      .module('blocks.logger')
      .factory('Dialog', Dialog);

  /* @ngInject */
  function Dialog(swal, logger, $q, $rootScope, $window, $document) {
    var service = {
      success:  successDialog,
      confirm:  confirmDialog,
      error:    errorDialog,
      genericError: genericErrorDialog,
      escapePromise: escapePromise
    };

    return service;
    /////////////////////

    function successDialog(title, text) {
      var deferred = $q.defer();

      $rootScope.modalOpen = true;

      swal({
        title: title,
        text: text,
        type: 'success'
      }, resolve);

      _attachKeyDown(resolve);

      deferred.promise
        .then(() => {
          $rootScope.modalOpen = false;
        })
        .catch(() => {
          $rootScope.modalOpen = false;
        });

      return deferred.promise;

      function resolve() {
        deferred.resolve();
      }
    }

    function errorDialog(title, text) {
      var deferred = $q.defer();

      $rootScope.modalOpen = true;

      swal({
        title: title,
        text: text,
        type: 'error'
      }, resolve);

      _attachKeyDown(resolve);

      deferred.promise
        .then(function(){
          $rootScope.modalOpen = false;
        })
        .catch(() => {
          $rootScope.modalOpen = false;
        });

      return deferred.promise;

      function resolve() {
        deferred.resolve();
      }
    }

    function confirmDialog(title, text, successFn) {
      var deferred = $q.defer();

      $rootScope.modalOpen = true;

      swal({
        title: title,
        text: text,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ffc823',
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No',
        closeOnConfirm: true
      }, function confirmSuccess(confirm) {
        if(typeof successFn === 'function') {
          successFn(confirm);
        }

        resolve(confirm);
      });

      _attachKeyDown(resolve);

      deferred.promise
        .then(() => { 
          $rootScope.modalOpen = false;
        })
        .catch(() => {
          $rootScope.modalOpen = false;
        });

      return deferred.promise;

      function resolve(confirm) {
        deferred.resolve(confirm || false);
      }
    }
    
    function genericErrorDialog(err, title){
      var message;

      if(typeof err === 'object') {
        if(err.data) {
          err = err.data;
        }
        if (err.error) {
          err = err.error;
        }

        message = err.message || err.msg;
      } else if (typeof err === 'string'){
        message = err;
      } else {
        throw new Error('An Error Occured. Unable to find error message (weird I know!).');
      }

      errorDialog(title || 'Uh oh', message);
    }

    function escapePromise() {
      return $q(function quit(){return null;});
    }

    function _attachKeyDown(fn) {
      let check = setInterval(function() {
        if ($('.swal2-modal').hasClass('swal2-hide')) {
          callback();
        }
      }, 100);

      $document.onkeydown = function(evt) {
        evt = evt || $window.event;
        if (evt.keyCode === 27) {
          callback();
        }
      };

      function callback() {
        $document.onkeydown = null;
        clearInterval(check);
        fn();
      }
    }
  }
}());
