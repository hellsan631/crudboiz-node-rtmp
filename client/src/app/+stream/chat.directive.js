;(function () {
  'use strict';

  angular
   .module('app.stream')
   .directive('chat', chat);

  /* @ngInject */
  function chat($window, $timeout) {
    return {
      restrict: 'E',
      template: `
        <div class="message-box tse-scrollable wrapper">
          <div class="tse-content">
            <div 
              ng-repeat="message in sm.messages track by message.id"
              class="message"
            >
              <div class="col s12">
                <div class="avatar" ng-if="::message.host">
                  <img class="responsive-img" src="images/host.png" />
                </div>
                <span 
                  style="color: {{ ::message.color }}" 
                  class="username"
                >
                  {{ ::message.username }}
                </span>
                
                <span 
                  class="text"
                  ng-bind-html="::message.text | embed"
                >
                </span>
              </div>
            </div>
          </div>
          <div 
            ng-if="sm.scroll.current !== sm.scroll.max"
            ng-click="sm.scrollBottom()"
            ng-class="sm.bounceAlert ? 'bounce' : ''"
            class="animate-events more-content center-align"
          >
            More Messages Below
          </div>
        </div>

        <div input-field class="send-message">
          <textarea 
            ng-model="sm.newMessage" 
            class="materialize-textarea"
            placeholder="Send A Message"
            min-length="3"
            ng-keypress="sm.keystroke($event)"
            spellcheck="false"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
          >
          </textarea>

          <a 
            ng-click="sm.addChat()"
            class="btn-floating primary-action waves-effect waves-light">
            <i class="material-icons small">send</i>
          </a>
        </div>
      `,
      scope: {},
      bindToController: {
        streamName: '<',
        member: '<'
      },
      controller: Controller,
      controllerAs: 'sm',
      link: link
    };

    function link(scope, element) {
      let sm = scope.sm;

      let messageBox = $('.message-box');
      let playerArea = $('.player-area');
      
      let scrollTrackerInit = false;
      let scrollContent;

      sm.scrollBottom = function(timer = 1000) {
        if (!scrollContent)
          return $timeout(() => sm.scrollBottom(timer), 120);

        scrollContent.animate({
          scrollTop: scrollContent[0].scrollHeight
        }, timer, 'easeInOutQuad');
      };

      function resize() {
        setTimeout(() => {
          let height = 400;

          if ($window.innerWidth > 1100) {
            height = playerArea.innerHeight();
          }
          
          element.css('height', height);
          messageBox.css('height', height - 71);

          if (scrollContent) {
            messageBox.TrackpadScrollEmulator('recalculate');
            return;
          }

          messageBox.TrackpadScrollEmulator();

          setTimeout(() => {
            scrollContent = $('.tse-scroll-content');
            scrollTracker();

            //this 100 ms is important to allow the scroll pad emupaltor dom to sync up
          }, 100);
        });
      }

      function scrollTracker() {
        if (scrollTrackerInit)
          return;
        else 
          scrollTrackerInit = true;

        let scrollInterval;

        scrollContent.scroll(function() {
          let currentPosition = scrollContent.scrollTop() +scrollContent.innerHeight();
          let scrollHeight = scrollContent[0].scrollHeight;

          if (scrollInterval) return;
          
          scrollInterval = setInterval(() => {
            let captureHeight = scrollContent.scrollTop() + scrollContent.innerHeight();

            if ( currentPosition === captureHeight ) {
              clearInterval(scrollInterval);

              requestAnimationFrame(() => {
                scope.$evalAsync(() => {
                  sm.scroll = {
                    current: currentPosition,
                    max: scrollHeight
                  };

                  scrollInterval = false;
                });             
              });

            } else {
              currentPosition = captureHeight;
            }
          }, 64);
        });
      }
    }
  }

  /* @ngInject */
  function Controller($scope, Widgets, Member, $timeout, Deep) {
    let sm = this;
    let firstLoad = false;

    Deep
      .getClient()
      .then(initClient);

    sm.displayDate = new Date();

    sm.displayDate.setDate(
      sm.displayDate.getDate() - 1
    );

    function initClient(client) {
      sm.messages = [];
      sm.addChat = addChat;

      let record = client.record.getRecord(`streams/${sm.streamName}`);

      record.subscribe('chat', (value) => {
        $scope.$evalAsync(() => {
          syncChat(value);
        });    
      });

      sm.keystroke = ($event) => {
        if ($event.which === 13) {
          $event.preventDefault();
          addChat();
        }
      };

      sm.addChat = addChat;

      if ($scope.$on) {
        $scope.$on('$destroy', function() {
          record.unsubscribe(() => {
            record.discard();
          });

          setTimeout(() => {
            client.close();
          }, 50);
        });
      }

      function addChat() {
        if (!sm.newMessage.length)
          return;

        sm.messages.push({
          id: Widgets.getGuid(),
          text: sm.newMessage,
          username: sm.member.username,
          timestamp: Math.floor((new Date()).getTime()),
          color: sm.member.color,
          avatar: Widgets.getProfileImage(sm.member),
          host: sm.streamName === sm.member.username
        });

        sm.newMessage = '';

        record.set('chat', sm.messages);
      }

      function syncChat(value) {
        sm.messages = filterChat(value);

        if (!firstLoad) {
          firstLoad = true;

          //wrap these in a timeout to allow for our dom to update
          requestAnimationFrame(() => {
            sm.scrollBottom(100);
          });

        } else {
          if (sm.scroll && sm.scroll.current === sm.scroll.max) {
            requestAnimationFrame(() => {
              sm.scrollBottom(200);
            });
          } else {
            sm.bounceAlert = true;

            $timeout(() => sm.bounceAlert = false, 2000);
          }
        }
      }

      function filterChat(messages) {
        let filterDate = new Date();

        filterDate.setDate(
          filterDate.getDate() - 5
        );

        return messages.filter((message) => {
          return new Date(message.timestamp) > filterDate;
        });
      }
    } 

  }
})();