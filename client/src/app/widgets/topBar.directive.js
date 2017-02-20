;(function () {
  'use strict';

  angular
   .module('app.widgets')
   .directive('topBar', topBar);

  /* @ngInject */
  function topBar() {
    return {
      restrict: 'E',
      template: `
        <nav class="anim-slide-above-fade">
          <div class="nav-wrapper white grey-text text-darken-4">
            <div class="container">
              
              <ul id="nav-mobile" class="left grey-text text-darken-4">
                <li ui-sref-active="active">
                  <a ui-sref="channels">Channels</a>
                </li>
              </ul>
            </div>

          </div>
        </nav>
      `,
      scope: {},
      bindToController: {
      },
      controller: Controller,
      controllerAs: 'dm'
    };
  }

  /* @ngInject */
  function Controller(Member) {
    var dm = this;

    Member
      .getCurrent()
      .$promise
      .then((member) => {
        dm.member = member;
      });

  }
})();