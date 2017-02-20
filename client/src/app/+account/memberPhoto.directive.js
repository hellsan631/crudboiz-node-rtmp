(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('memberPhoto', memberPhoto);

  /* @ngInject */
  function memberPhoto() {
    return {
      restrict: 'E',
      template: `
        <div class="card-panel big-shadow white">
          <div class="row">
            <div class="col s12"> </div>
          </div>
          <div class="row extra-margin-bottom">
            <div class="col s12 center-align" 
              ngf-drop 
              ngf-select 
              ng-model="dm.profileImage" 
              ngf-pattern="'image/*'" 
              ngf-accept="'image/*'"
              ngf-validate-fn="dm.validate($file)"
            >

              <div class="profile-image" 
                ngf-thumbnail="dm.profileImage || dm.placeholder" 
                ngf-as-background="true">
              </div>

            </div>
          </div>

          <div class="row">
            <div class="col s12 center-align">
              <button type="submit" 
                class="btn btn-flat btn-small secondary-action waves-effect waves-primary" 
                ng-disabled="dm.loading !== false"
                ngf-select 
                ng-model="dm.profileImage" 
                name="profileImage" 
                ngf-pattern="'image/*'" 
                ngf-accept="'image/*'" 
                ngf-validate-fn="dm.validate($file)"
              >

                <span ng-if="!dm.loading">Change Photo</span>

                <div ng-if="dm.loading" 
                  class="preloader-svg-wrapper animate-bounce">
                  <img class="loading-image" ng-src="images/svg-loaders/{{ dm.loaderAnimation || 'three-dots' }}.svg" />
                </div>

              </button>
            </div>
          </div>
        </div>
      `,
      scope: {},
      bindToController: {
        member: '=',
      },
      controller: Controller,
      controllerAs: 'dm'
    };
  }

  /* @ngInject */
  function Controller($scope, Dialog, Upload, MemberPhoto) {
    var dm = this;
    dm.loading = false;

    if(dm.member.profileImage) {
      dm.placeholder = dm.member.profileImage;
    } else {
      dm.placeholder = 'images/sans_512.jpg';
    }

    dm.resizing = false;


    $scope.$watchCollection('dm.finalPhoto', (image, old) => {
      if (image && !dm.loading) {
        console.log(image);

        dm.loading = true;

        MemberPhoto
          .upload(image)
          .then((results) => {
            console.log(results);
            dm.member.profileImage = results.url;
            dm.loading = false;
          })
          .catch((err) => {
            Dialog.genericError(err);
            dm.loading = false;
          });
      }
    });

    dm.validate = function(file) {
      var valid = true;

      //if file is over 1mb try and resize the photo
      if (Upload.isResizeSupported() && !dm.resizing) {
        dm.resizeFile(file);
      } else if (!Upload.isResizeSupported() && !dm.resizing) {
        dm.finalPhoto = file;
      }

      return valid;
    };

    dm.resizeFile = function(file) {
      dm.resizing = true;
      Upload
        .resize(file, 350, 350, 0.9, file.type)
        .then(function(resizedFile) {

          // We dont need to warn about filesize here because we are using the new api
          dm.finalPhoto = resizedFile;

          dm.resizing = false;
        });
    };

    

  }
})();
