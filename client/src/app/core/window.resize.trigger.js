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
    }, 16);

  });

  // This creates an iframe and adds a resize event when the scrollbar is removed
  var iframe = document.createElement('iframe');
  iframe.id = "hacky-scrollbar-resize-listener";
  iframe.style.cssText = 'height: 0; background-color: transparent; margin: 0; padding: 0; overflow: hidden; border-width: 0; position: absolute; width: 100%;';

  // Register our event when the iframe loads
  iframe.onload = function() {
    // The trick here is that because this iframe has 100% width 
    // it should fire a window resize event when anything causes it to 
    // resize (even scrollbars on the outer document)
    iframe.contentWindow.addEventListener('resize', function() {
      try {
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('resize', true, false, window, 0);
        window.dispatchEvent(evt);
      } catch(e) {}
    });
  };

  // Stick the iframe somewhere out of the way
  document.body.appendChild(iframe);
})();
