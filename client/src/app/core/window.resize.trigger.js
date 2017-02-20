;(function () {
  'use strict';

  let interval = false;
  let windowSize = {
    width: window.innerWidth,
    height: window.innerWidth
  };

  $(window).resize(function () {
    if (interval) return;
          
    interval = setInterval(() => {
      if (
        windowSize.height === window.innerHeight &&
        windowSize.width === window.innerWidth
      ) {
        clearInterval(interval);

        requestAnimationFrame(() => {
          interval = false;
          $(window).trigger('window:resize');
        });

      } else {
        windowSize.height = window.innerHeight;
        windowSize.width  = window.innerWidth;
      }
    }, 64);

  });
})();
