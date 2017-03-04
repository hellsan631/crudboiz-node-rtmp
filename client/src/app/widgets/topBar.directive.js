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
          <div class="nav-wrapper grey darken-3">
            <div class="container">
              
              <ul id="nav-mobile" class="left">
                <li ui-sref-active="active">
                  <a ui-sref="channels">Channels</a>
                </li>
                <li ng-if="dm.member" ui-sref-active="active">
                  <a ui-sref="guide">Guide</a>
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
  function Controller($scope, $rootScope, Member) {
    var dm = this;

    let cleanupSubscribeBinding = $rootScope.$on(
      'loginEvent', 
      setCurrentMember
    );

    /**
     * Binds to the scope to clean up the event binding when no longer in use
     * to avoid memory leaks
     */
    if ($scope.$on) {
      $scope.$on('$destroy', function() {
        cleanupSubscribeBinding();
      });
    }

    setCurrentMember();

    function setCurrentMember() {
      Member
        .getCurrent()
        .$promise
        .then((member) => {
          dm.member = member;
        });
    }

  }
})();