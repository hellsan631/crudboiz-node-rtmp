(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('userFab', userFab);

  /* @ngInject */
  function userFab($rootScope, Widgets, Member) {

    return {
      restrict: 'E',
      transclude: true,
      template: `
        <div class="user-fab-container">
          <!-- Dropdown Trigger -->
          <a
            class="dropdown-button btn-floating btn-large"
            style="background-image: url({{ sm.profileImage }})"
            data-activates="userFabDropdown"
            href="javascript:void(0);"
            dropdown
            data-hover="false"
          >
          </a>

          <!-- Dropdown Structure -->
          <ul 
            id="userFabDropdown" 
            class="dropdown-content right-align"
          >
            <div ng-if="sm.member">
              <li><a ui-sref="account">My Account</a></li>
              <li><a ng-click="sm.logout()">Logout</a></li>
            </div>
            <div ng-if="!sm.member">
              <li><a ui-sref="login">Login</a></li>
              <li><a ui-sref="signup">Signup</a></li>
            </div>
          </ul>

          <div class="spend-amount">
            {{ sm.member.username }} 
          </div>
        </div>
      `,
      scope: {},
      bindToController: true,
      controller: Controller,
      controllerAs: 'sm',
      link: link
    };

    function link(scope, element) {
      let sm = scope.sm;

      let cleanupSubscribeBinding = $rootScope.$on(
        'loginEvent', 
        loadCurrentMember
      );

      /**
       * Binds to the scope to clean up the event binding when no longer in use
       * to avoid memory leaks
       */
      if (scope.$on) {
        scope.$on('$destroy', function() {
          cleanupSubscribeBinding();
        });
      }

      loadCurrentMember();

      function loadCurrentMember() {
        Widgets
          .currentMember()
          .then((member) => {
            sm.member = member;
            sm.profileImage = Widgets.getProfileImage(member);
          })
          .catch(() => {
            sm.profileImage = Widgets.getProfileImage();
          });
      }
    }
  }

  /* @ngInject */
  function Controller($rootScope, $localForage, Widgets, Member, $state) {
    var sm = this;

    sm.logout = () => {
      Member
        .logout()
        .$promise
        .then(() => {
          sm.profileImage = Widgets.getProfileImage();
          sm.member = false;

          return $localForage.setItem('lastLogin', false);
        })
        .then(() => {
          return $localForage.removeItem('currentMember');
        })
        .then(() => {
          $rootScope.$broadcast('loginEvent');
          //$state.reload();
        });
    };
  }

  
})();
