;(function () {
  'use strict';

  angular
   .module('app.signup')
   .directive('validateUsername', validateUsername);

  /* @ngInject */
  function validateUsername($q, Member, logger) {
    return  {
      restrict: 'A',
      require: 'ngModel',
      link: link
    };

    function link(scope, elm, attrs, ctrl) {
      let lastCheck = {
        value: false,
        valid: false
      };

      let waiting;

      ctrl.$asyncValidators.validateEmail = function(modelValue) {

        if (lastCheck.value === modelValue) {
          if (lastCheck.valid)
            return $q.resolve();
          else 
            return $q.reject();
        } else {
          lastCheck.value = modelValue;
        }

        if (ctrl.$isEmpty(modelValue)) {
          lastCheck.valid = false;
          return $q.reject();
        }

        if (modelValue.indexOf('@') === -1 || modelValue.indexOf('.') === -1) {
          lastCheck.valid = false;
          return $q.reject();
        }

        var def = $q.defer();

        waiting = true;

        logger.info('Checking Username...', null, 500);

        Member
          .findOne({
            filter: {
              where: {
                username: modelValue
              }
            }
          })
          .$promise
          .then((member) => {
            if (member && member.id) {
              notValid('Member already exists');
            } else {
              valid();
            }
          })
          .catch((err) => {
            if (err.status === 404)
              valid();
            else
              notValid(err.message);
          });

        return def.promise;

        function valid() {
          lastCheck.valid = true;
          waiting = false;
          logger.info('Username Valid', null, 4000);
          def.resolve();
        }

        function notValid(err) {
          waiting = false;
          lastCheck.valid = false;
          logger.info(err, null, 4000);
          def.reject();
        }
      };
    }
  }
})();