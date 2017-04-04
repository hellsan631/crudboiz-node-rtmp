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
    vm.liveUrl = 'rtmp://crudboiz.tv/live';
    vm.liveKey = `${vm.member.username}?key=${vm.member.rtmpKey}`;

  }
})();
