;(function () {
  'use strict';

  angular
   .module('app.account')
   .factory('MemberPhoto', MemberPhoto);

  /* @ngInject */
  function MemberPhoto(Upload, Widgets, $q) {
    const API_URL = 'api/containers/crudboiz';

    return {
      upload: upload,
      _rename: _rename,
      _upload: _upload
    };

    function upload(image) {
      let deferred = $q.defer();

      let resolved = {};

      _rename(image)
        .then((renamed) => {
          resolved = renamed;

          return $q.resolve(renamed.image);
        })
        .then(_upload)
        .then((res) => {
          resolved.result = res;

          deferred.resolve(resolved);
        })
        .catch(deferred.reject);

      return deferred.promise;
    }

    function _rename(image) {
      let deferred = $q.defer();

      const NAME = Widgets.getGuid() + '.' + image.name.split('.').pop();

      deferred.resolve({
        image: Upload.rename(image, NAME),
        name:  NAME,
        url:  `${API_URL}/download/${NAME}`
      });

      return deferred.promise;
    }

    // handles the actual http call to upload
    function _upload(imageFile) {
      let deferred = $q.defer();

      let uploadData = {
        url: `${API_URL}/upload`,
        data: {
          file: imageFile
        }
      };

      Upload
        .upload(uploadData)
        .then(
          deferred.resolve, 
          deferred.reject,  
          deferred.notify
        );

      return deferred.promise;
    }
  }
})();