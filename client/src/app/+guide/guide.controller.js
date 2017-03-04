/* global Raven:false */

;(function() {
  'use strict';

  angular
    .module('app.guide')
    .controller('GuideController', Controller);

  /* @ngInject */
  function Controller(member) {
    let vm = this;

    vm.member = member;

  }
})();
