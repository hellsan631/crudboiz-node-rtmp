; (function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('colorPicker', colorPicker);

  /* @ngInject */
  function colorPicker(MaterialColors, Elements) {
    return {
      restrict: 'E',
      template: `
        <div class="material-color-picker">
          <div class="material-color-picker__left-panel">
            <ol class="color-selector">
              <li 
                ng-repeat="color in dm.materialColors track by color.color" 
                ng-click="dm.selectedColor = color"
              >
                <input 
                  name="material-color" 
                  type="radio"
                  ng-checked="dm.selectedColor === color"
                />
                <label ng-style="{{ dm.getRadioStyle(color) }}"></label>
              </li>
            </ol>
          </div>
          <div 
            class="material-color-picker__right-panel" 
          >
            <div 
              class="color-palette-wrapper js-active"
              ng-class="dm.selectedColor ? 'js-active' : ''"
            >
              <h4 class="color-palette-header">
                {{ dm.selectedColor.color }}<br/>
                <small>Chat Color</small>
              </h4>
              <h6 class="color-palette-bottom">
                
              </h6>
              <ol class="color-palette">
                <li 
                  ng-repeat="variation in dm.selectedColor.variations track by variation.hex" 
                  class="color-palette__item animate-slide-up"
                  ng-click="dm.selectedVariation = variation"
                  ng-style="{{ dm.getBlockStyle(variation) }}"
                >
                  <span>{{ variation.weight }}</span>
                  <span class="right">{{ variation.hex }}</span>
                  <span 
                    class="copied-indicator" 
                    ng-class="dm.selectedVariation === variation ? 'js-copied' : ''"
                  >
                    Color selected!
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      `,
      scope: {},
      bindToController: {
        color: '='
      },
      controller: Controller,
      controllerAs: 'dm',
      link: link
    };

    function link(scope, element) {
      let dm = scope.dm;
      let scrollable = element.find('.color-scrollable');

      scope.$watch('dm.selectedVariation', (color) => {
        if (color && dm.color !== color.hex)
          dm.color = color.hex;
      });

      dm.materialColors = MaterialColors.getColors();

      scope.dm.getRadioStyle = (color) => {
        return {
          color:  color.variations[4].hex
        };
      };

      dm.getBlockStyle = (variation) => {
        return {
          'background-color': variation.hex,
          color: Elements.textColor(variation.hex)
        };
      };

      dm.initMemberColor = () => {
        for (let i = 0; i < dm.materialColors.length; i++) {
          let color = dm.materialColors[i];
          let k = 0;

          for (k = 0; k < color.variations.length; k++) {
            let variation = color.variations[k];

            if (!dm.selectedColor || dm.color === variation.hex) {
              dm.selectedVariation = variation;
              dm.selectedColor = color;
            }
          }
        }
      };

      dm.initMemberColor();
    }
  }

  /* @ngInject */
  function Controller() {
    let dm = this;

  }
})();