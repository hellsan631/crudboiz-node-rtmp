;(function () {
  'use strict';

  angular
   .module('app.widgets')
   .factory('Widgets', Widgets);

  /* @ngInject */
  function Widgets() {

    return {
      getGuid: getGuid,
      getFreshUrl: getFreshUrl,
      generateKey: generateKey,
      getProfileImage: getProfileImage
    };

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