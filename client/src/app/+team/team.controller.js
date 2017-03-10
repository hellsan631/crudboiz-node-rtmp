/* global Raven:false */

;(function() {
  'use strict';

  angular
    .module('app.team')
    .controller('TeamController', Controller);

  /* @ngInject */
  function Controller(member) {
    let vm = this;

    vm.member = member;

  }
})();
