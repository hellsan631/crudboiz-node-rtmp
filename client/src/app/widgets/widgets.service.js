;(function () {
  'use strict';

  angular
   .module('app.widgets')
   .factory('Widgets', Widgets);

  /* @ngInject */
  function Widgets($q, $http, $localForage, Member, Dialog) {

    const WEBHOOK_KEY = `rS6XnhcjDS6ZxU6-CjEIWpp2T-I8AQxE_VCB1aULJVwbfDeLBluRugFGTv19_rEE8jMo`;
    const WEBHOOK_URL = `https://discordapp.com/api/webhooks/304021524325728257/${WEBHOOK_KEY}`;

    return {
      liveAlert: liveAlert,
      currentMember: currentMember, 
      getGuid: getGuid,
      getFreshUrl: getFreshUrl,
      generateKey: generateKey,
      getProfileImage: getProfileImage
    };

    // checks to see if the last alert occured within a 15 minuet timeframe
    function lastAlert() {
      let deferred = $q.defer();
      
      $localForage
        .getItem('lastAlert')
        .then((alert) => {

          if (!alert) {
            return $localForage.setItem('lastAlert', new Date());
          }

          var now = new Date();
          var limit = new Date(alert);

          limit.setMinutes( now.getMinutes() - 1 );

          if (typeof alert === 'string') {
            try {
              alert = new Date(alert);
            } catch (e) {
              deferred.reject(
                new Error('You need to wait 1 minuet between sending alerts')
              );
            }
          }

          if (alert > limit) {
            deferred.resolve(true);
          }

          deferred.reject(
            new Error('You need to wait 1 minuet between sending alerts')
          );
        })
        .then(() => {
          deferred.resolve(true);
        })
        .catch((err) => {
          console.log(err);
          deferred.resolve(true);
        });

      return deferred.promise;
    }

    function liveAlert(username) {
      let deferred = $q.defer();

      let payload = {
        content: `${username} is live on http://crudboiz.tv/stream/${username}`
      };

      lastAlert()
        .then(() => {
          return $http.post(WEBHOOK_URL, payload);
        })
        .then((res) => {
          deferred.resolve(res.data);
        })
        .catch(Dialog.genericError);

      return deferred.promise;
    }

    function currentMember() {
      let deferred = $q.defer();

      let found;

      $localForage
        .getItem('currentMember')
        .then((member) => {
          if (member) {
            return deferred.resolve(member);
          } else {
            return Member.getCurrent().$promise;
          }
        })
        .then((member) => {
          if (!member)
            return;

          found = member;

          return $localForage.setItem('currentMember', member);
        })
        .then((res) => {
          return deferred.resolve(found);
        })
        .catch((err) => {
          $localForage.removeItem('currentMember');

          deferred.reject(err);
        });
      
      return deferred.promise;
    }

    function getGuid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

    function getFreshUrl(url) {
      return `${url}?d=${Math.floor((new Date()).getTime())}`;
    }

    function generateKey(keyLength = 24) {
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let text = '';

      for (let i = 0; i < keyLength; i++) {
        text += possible.charAt(
          Math.floor(Math.random() * possible.length)
        );
      }
          
      return text;
    }

    function getProfileImage(member = {}) {
      let profileImage = member.profileImage || 'images/moose.jpg';

      if (member.id && !member.profileImage)
        profileImage = 'images/sans_512.jpg';

      return profileImage;
    }
  }
})();