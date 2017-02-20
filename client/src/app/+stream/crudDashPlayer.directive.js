;(function () {
  'use strict';

  angular
   .module('app.stream')
   .directive('crudDashPlayer', crudDashPlayer);

  /* @ngInject */
  function crudDashPlayer() {

    var directive = {
      restrict: 'E',
      template: `
        <video id="crud-player" controls></video>
      `,
      scope: {},
      bindToController: {
        stream: '<'
      },
      controller: Controller,
      controllerAs: 'dm',
      link: link
    };

    return directive;

    function link(scope, element) {
      let dm = scope.dm;
      let playerElement = element.find('.crud-player')[0];
      
      var player = dashjs.MediaPlayer().create();

      player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, function () {
        var bitRates = player.getBitrateInfoListFor('video');
        console.log(bitRates);
      });

      player.initialize(playerElement, dm.stream.dashUrl, true);
      let dashdebug = player.getDebug();
      //player.play();
      player.attachSource(dm.stream.dashUrl);

      //https://github.com/sergey-dryabzhinsky/nginx-rtmp-module
      //recompile nginx with this
      
      
    }
  }

  /* @ngInject */
  function Controller() {
    var dm = this;

    console.log(dm.stream);

  }
})(); 