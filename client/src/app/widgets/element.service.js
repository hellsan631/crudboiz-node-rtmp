(function() {
  'use strict';

  angular
    .module('app.widgets')
    .factory('Elements', Service);

  /* @ngInject */
  function Service(Vibrant, $window, $q) {
    let badImages = [];
    let goodImages = [];

    return {
      getBoundingClientRect: getBoundingClientRect,
      topOffScreen: topOffScreen,
      bottomOffScreen: bottomOffScreen,
      rightOffScreen: rightOffScreen,
      leftOffScreen: leftOffScreen,
      offScreen: offScreen,
      textColor: textColor,
      generateShadowGradient: generateShadowGradient,
      getBoxShadow: getBoxShadow,
      getRGBA: getRGBA,
      vibrant: vibrant,
      delightfulShadow: delightfulShadow
    };

    function delightfulShadow(imageUrl, depth = 64) {
      let deferred = $q.defer();

      vibrant(imageUrl, true)
        .then((palette) => {
          let color;

          if (palette.Vibrant)
            color = palette.Vibrant.getRgb();
          else if (palette.DarkVibrant)
            color = palette.DarkVibrant.getRgb();
          else if (palette.Muted)
            color = palette.Muted.getRgb();
          else if (palette.DarkMuted)
            color = palette.DarkMuted.getRgb();
          else if (palette.LightVibrant)
            color = palette.LightVibrant.getRgb();
          else if (palette.LightMuted)
            color = palette.LightMuted.getRgb();
          else
            color = [0,0,0];

          let YIQ = (
            (color[0]*299)+
            (color[1]*587)+
            (color[2]*118)
          )/1000;

          let opacity = 0.4;

          if (color[1] > color[0] && color[1] > color[2]) {
            if (color[1] < 150)
              YIQ += 5;
            else
              YIQ -= 25;
          } else if (color[0] > color[1] && color[0] > color[2]) {
            if (color[0] < 150)
              YIQ -= 15;
            else
              YIQ += 5;
          } else if (color[1] > color[2]) {
            YIQ += 20;
          } else if (color[2] > color[1]) {
            YIQ -= 40;
          }

          if (color[0] > 180) {
            YIQ -= 10;
          }

          if (color[1] > 180) {
            YIQ -= 10;
          }

          if (YIQ >= 180) {
            opacity = 0.4;
          } else if (YIQ >= 145) {
            opacity = 0.3;
          } else if (YIQ >= 120) {
            opacity = 0.2;
          } else if (YIQ >= 100) {
            opacity = 0.25;
          } else if (YIQ >= 80) {
            opacity = 0.35;
          } else if (YIQ >= 64) {
            opacity = 0.3;
          } else if (YIQ < 45) {
            opacity = 0.2;
          }

          deferred.resolve(
            generateShadowGradient(2, depth, color, opacity)
          );
        })
        .catch(deferred.reject);
      
      return deferred.promise;
    }

    function textColor(hexcolor) {
      var r = parseInt(hexcolor.substr(0,2),16);
      var g = parseInt(hexcolor.substr(2,2),16);
      var b = parseInt(hexcolor.substr(4,2),16);
      var yiq = ((r*299)+(g*587)+(b*114))/1000;
      return (yiq >= 128) ? '#212121' : '#fff';
    }

    function generateShadowGradient(steps, maximum, color, opacity = 0.3) {
      var shadow = '';

      for (var i = steps; i <= maximum; i = i*steps) {
        shadow += getBoxShadow('0px '+i+'px '+(i*1.5)+'px', getRGBA(color, opacity));
        shadow += i >= maximum ? '' : ',';
      }

      return shadow;
    }

    function getBoxShadow(px, color) {
      return px + ' ' + color;
    }

    function getRGBA(color, opacity) {
      var r = 0; var g = 1; var b = 2;
      return `rgba(${Math.floor(color[r])}, ${Math.floor(color[g])}, ${Math.floor(color[b])}, ${opacity})`;
    }

    function vibrant(url, newCache) {
      var deferred = $q.defer();

      if (!url) return $q.reject(new Error('no url specified'));

      if (badImages.includes(url)) {
        return $q.reject(new Error('image failed to load before'));
      } else if (url.indexOf('crudboiz') === -1) {
        return $q.reject(new Error('image url off target'));
      } else if (goodImages[url]) {
        return $q.resolve(goodImages[url]);
      }

      var error = 0;
      var img = document.createElement('img');

      img.crossOrigin = 'anonymous';

      img.addEventListener('load', () => {
        var palette = new Vibrant(img);

        requestAnimationFrame(() => {
          var result = palette.swatches();

          goodImages[url] = result;

          deferred.resolve(result);
        });
      });

      img.addEventListener('error', () => {
        deferred.reject(new Error('Bad Image Detected'));
      });

      requestAnimationFrame(() => {
        if (newCache)
          url += '?' + (new Date()).getTime();
          
        img.src = url;
      });
    
      return deferred.promise;
    }

    function offScreen(el) {
      var rect = el.getBoundingClientRect();
      return (
        (rect.left + rect.width) < 0 ||
        (rect.top + rect.height) < 0 ||
        (rect.left > $window.innerWidth || rect.top > $window.innerHeight)
      );
    }

    function topOffScreen(container, ele) {
      return getBoundingClientRect(container).top < getBoundingClientRect(ele).top;
    }

    function bottomOffScreen(container, ele) {
      return getBoundingClientRect(container).bottom < getBoundingClientRect(ele).bottom;
    }

    function rightOffScreen(container, ele) {
      return getBoundingClientRect(container).right < getBoundingClientRect(ele).right;
    }

    function leftOffScreen(container, ele) {
      return getBoundingClientRect(container).left > getBoundingClientRect(ele).left;
    }

    function getBoundingClientRect(ele) {
      return ele.getBoundingClientRect();
    }
  }
})();
