;(function () {
  'use strict';

  angular
   .module('app.account')
   .directive('channelDetails', channelDetails);

  /* @ngInject */
  function channelDetails() {
    return {
      restrict: 'E',
      template: `
        <div class="card-panel big-shadow white">
          <div class="row">
            <div class="col s12 center-align">
              <h4>Channel Details</h4>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <material-input
                name="title"
                label="Title"
                placeholder=" "
                validate="true"
                required="true"
                ng-model="dm.channel.title"
              >
              </material-input>
            </div>
            <div class="col s12">
              <material-input
                name="game"
                label="Game"
                placeholder=" "
                validate="true"
                required="true"
                ng-model="dm.channel.game"
              >
              </material-input>
            </div>
            <div class="col s12">
              <div input-field class="send-message">
                <textarea 
                  ng-model="dm.channel.description" 
                  class="materialize-textarea"
                  placeholder="Descirption"
                >
                </textarea>
              </div>
            </div>
          </div>
        </div>
      `,
      scope: {},
      bindToController: {
        channel: '='
      },
      controller: Controller,
      controllerAs: 'dm'
    };
  }

  /* @ngInject */
  function Controller() {
    let dm = this;

  }
})();