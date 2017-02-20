;(function() {
  'use strict';

  angular
    .module('app.account')
    .config(AppConfig);

  /* @ngInject */
  function AppConfig($stateProvider) {

    const VIEWS = {
      'navbar@': {
        template: `<top-bar></top-bar>`,
        controller: function() {},
        controllerAs: 'vm'
      },
      'main@': {
        templateUrl: 'app/+account/account.html',
        controller: 'AccountController',
        controllerAs: 'vm'
      }
    };

    const PERMISSIONS = {
      permissions: {
        only: ['isLoggedIn'],
        redirectTo: 'channels'
      }
    };

    const RESOLVER = {
      member: getMember
    };

    $stateProvider
      .state('account', {
        url: '/account',
        title: 'account',
        views: VIEWS,
        data: PERMISSIONS,
        resolve: RESOLVER
      });
  }

  /* @ngInject */
  function getMember($q, Member) {
    var deferred = $q.defer();

    Member
      .getCurrent()
      .$promise
      .then((member) => {
        let query = {
          filter: {
            where: {
              id: member.id
            },
            include: 'channel'
          }
        };

        return Member.findOne(query).$promise;
      })
      .then(deferred.resolve)
      .catch(deferred.reject);

    return deferred.promise;
  }

})();
