//External Lib Constants

/* global 
  Materialize:false, 
  swal:false, 
  Stripe:false,
  MaterialAvatar:false, 
  Clipboard:false,
  Vibrant: false,
  Clappr: false,
  deepstream: false,
  Raven: false,
  randomColor: false,
  videojs: false
*/

;(function() {

  'use strict';

  angular
    .module('app.core')
    .constant('Materialize', Materialize)
    .constant('Clappr', Clappr)
    .constant('Vibrant', Vibrant)
    .constant('deepstream', deepstream)
    .constant('Raven', Raven)
    .constant('randomColor', randomColor)
    .constant('swal', swal)
    .constant('videojs', videojs);

})();
