var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(['require', 'baseClasses/RealTimeCommunicationChannel', 'jquery-popup', 'jquery', 'gameplay/Gamefield', 'baseClasses/UtilsAppfurnace', 'moment', 'gameplay/Joker'], function(require, RealTimeCommunicationChannel, unused, $, Gamefield, UtilsAppfurnace, moment, Joker) {
  var Game;
  Game = (function() {
    Game.gameStates = {
      INSIDE_ZONE: 10,
      ON_STARTPOINT: 20,
      OUTSIDE_ZONE: 30,
      STARTED: 40,
      WAITING_FOR_PLAYER: 50,
      TIMER_END: 55,
      FINISHED: 60
    };

    Game.currentGame = null;

    Game.onMapClick = function() {
      if (Game.currentGame !== null) {
        Game.currentGame.destroy();
      }
      Game.currentGame = new Game(this.name());
      return console.log(['onMapShow', arguments, this.uid()]);
    };

    function Game(mapId) {
      this.startGame = __bind(this.startGame, this);
      this.getState = __bind(this.getState, this);
      this.setState = __bind(this.setState, this);
      this.onStartPointMoveOut = __bind(this.onStartPointMoveOut, this);
      this.onStartPointMoveIn = __bind(this.onStartPointMoveIn, this);
      this.onZoneMoveOut = __bind(this.onZoneMoveOut, this);
      this.onZoneMoveIn = __bind(this.onZoneMoveIn, this);
      this.onGameFinisched = __bind(this.onGameFinisched, this);
      this.onGameStart = __bind(this.onGameStart, this);
      this.onPlayerLeft = __bind(this.onPlayerLeft, this);
      this.onPlayerJoin = __bind(this.onPlayerJoin, this);
      this.onTimerEnd = __bind(this.onTimerEnd, this);
      this.onJokerPointMoveIn = __bind(this.onJokerPointMoveIn, this);
      this.onCoinPointMoveIn = __bind(this.onCoinPointMoveIn, this);
      this.incrementCoins = __bind(this.incrementCoins, this);
      this.onCurrentJokerClick = __bind(this.onCurrentJokerClick, this);
      this.onGamePointMoveIn = __bind(this.onGamePointMoveIn, this);
      this.showPopupContent = __bind(this.showPopupContent, this);
      this.startTimer = __bind(this.startTimer, this);
      var self;
      self = this;
      this.setState(Game.gameStates.OUTSIDE_ZONE);
      this.$popup = $("<div class='popup'></div>");
      $("body").append(this.$popup);
      this.$popup.popup({
        width: $(window).width() * 0.8,
        height: 150
      });
      this.coins = 0.0;
      this.currentJoker = null;
      this.playerCount = 0;
      this.name = mapId.replace(" ", "");
      this.gamefield = new Gamefield(this.name);
      this.gamefield.setZoneMoveIn(this.onZoneMoveIn);
      this.gamefield.setStartPointMoveIn(this.onStartPointMoveIn);
      this.gamefield.setZoneMoveOut(this.onZoneMoveOut);
      this.gamefield.setStartPointMoveOut(this.onStartPointMoveOut);
      this.gamefield.setAllPointsMoveIn(this.onGamePointMoveIn);
      this.gamefield.displayPoint(this.gamefield.getStartPoint());
      this.remainingTime = this.gamefield.getDefaultTime();
      this.channel = new RealTimeCommunicationChannel('presence-' + this.map);
      this.channel.channelSubscription.done(function() {
        self.channel.channel.bind("pusher:member_added", self.onPlayerJoin);
        self.channel.channel.bind("pusher:member_removed", self.onPlayerLeft);
        self.channel.channel.bind("client-startGame", self.onGameStart);
        return self.channel.channel.bind("client-gameFinisched", self.onGameFinisched);
      });
      this.gamefield.getJokerNode().click(this.onCurrentJokerClick);
    }

    Game.prototype.startTimer = function() {
      var self, startTime, timer;
      startTime = moment();
      self = this;
      return timer = window.setInterval(function() {
        self.remainingTime = self.remainingTime - 1000;
        if (self.remainingTime <= 0) {
          clearInterval(timer);
          self.remainingTime = 0;
          self.onTimerEnd();
        }
        return self.gamefield.getTimerNode().html("Zeit: " + moment(self.remainingTime).format("mm:ss"));
      }, 1000);
    };

    Game.prototype.showPopupContent = function($el) {
      var $popup, dfr;
      if (this.$popup.children().length > 0) {
        UtilsAppfurnace.storePage(this.$popup.children().first());
      }
      this.$popup.html($el);
      dfr = jQuery.Deferred();
      $popup = this.$popup;
      this.$popup.data('popup').o.afterOpen = function() {
        return dfr.resolve($("body").find(".popup_cont").first());
      };
      this.$popup.data('popup').o.afterClose = function() {
        if ($popup.children().length > 0) {
          return UtilsAppfurnace.storePage($popup.children().first());
        }
      };
      this.$popup.data('popup').open(this.$popup);
      return dfr.promise();
    };

    Game.prototype.onGamePointMoveIn = function(coord) {
      var gameState, point, type;
      point = this.gamefield.getPointByCoord(coord);
      type = this.gamefield.getPointTypeName(point.getName());
      gameState = this.getState();
      if (__indexOf.call(this.gamefield.getVisiblePoints(), point) >= 0 && (gameState === Game.gameStates.STARTED || gameState === Game.gameStates.WAITING_FOR_PLAYER)) {
        this.incrementCoins(this.gamefield.getCoinPayments());
        if (type === Gamefield.pointTypes.COIN) {
          return this.onCoinPointMoveIn();
        } else if (type === Gamefield.pointTypes.JOKER) {
          return this.onJokerPointMoveIn();
        } else {
          throw new Error("Underknow point Type");
        }
      }
    };

    Game.prototype.onCurrentJokerClick = function() {
      var self;
      self = this;
      if (this.currentJoker === null) {
        return this.showPopupContent(UtilsAppfurnace.getPage("Popup.onCurrentJokerClickNoJoker"));
      } else {
        return this.showPopupContent(UtilsAppfurnace.getPage("Popup.onCurrentJokerClick")).done(function($content) {
          UtilsAppfurnace.getUIElementByName("ui.label.jokerDescription", $content).html(self.currentJoker.getDescription());
          return UtilsAppfurnace.getUIElementByName("ui.btn.jokerApply", $content).click(self.currentJoker.applyEffekt);
        });
      }
    };

    Game.prototype.incrementCoins = function(increment) {
      this.coins += increment;
      return this.gamefield.getCoinNode().html("Münzen: " + this.coins);
    };

    Game.prototype.onCoinPointMoveIn = function() {
      this.gamefield.displayNextRound();
      return this.showPopupContent(UtilsAppfurnace.getPage("Popup.onCoinPointMoveIn"));
    };

    Game.prototype.onJokerPointMoveIn = function() {
      var $currentJoker, annimateAllJokerTypes, i, newJoker;
      $currentJoker = this.gamefield.getJokerNode();
      newJoker = Joker.getRandomJoker();
      this.showPopupContent(UtilsAppfurnace.getPage("Popup.onJokerPointMoveIn"));
      i = 0;
      annimateAllJokerTypes = function($node) {
        var dfr;
        dfr = $.Deferred();
        Joker.animateImgageNode($node, Joker.jokerTypes.STEAL_COINS).done(function() {
          return Joker.animateImgageNode($node, Joker.jokerTypes.STEAL_TIME).done(function() {
            if (i !== 2) {
              annimateAllJokerTypes($node);
            } else {
              dfr.resolve();
            }
            return i += 1;
          });
        });
        return dfr.promise();
      };
      annimateAllJokerTypes($currentJoker).done(function() {
        return Joker.animateImgageNode($currentJoker, newJoker.getType());
      });
      return this.currentJoker = newJoker;
    };

    Game.prototype.onTimerEnd = function() {
      this.setState(Game.gameStates.TIMER_END);
      this.gamefield.hidePoints(this.gamefield.getVisiblePoints());
      this.gamefield.displayPoint(this.gamefield.getStartPoint());
      return this.showPopupContent(UtilsAppfurnace.getPage("Popup.onTimerEnd"));
    };

    Game.prototype.onPlayerJoin = function() {
      this.playerCount += 1;
      return popup("Ein Spieler hat das Spielfeld betreten");
    };

    Game.prototype.onPlayerLeft = function() {
      this.playerCount -= 1;
      return popup("Ein Spieler hat das Spielfeld verlassen");
    };

    Game.prototype.onGameStart = function() {
      this.setState(Game.gameStates.STARTED);
      this.startTimer();
      this.incrementCoins(0);
      this.gamefield.displayNextRound();
      return this.showPopupContent(UtilsAppfurnace.getPage("Popup.onGameStart"));
    };

    Game.prototype.onGameFinisched = function() {
      this.setState(Game.gameStates.FINISHED);
      return this.showPopupContent(UtilsAppfurnace.getPage("Popup.onGameFinisched"));
    };

    Game.prototype.onZoneMoveIn = function() {
      if (this.gameState === Game.gameStates.OUTSIDE_ZONE) {
        this.setState(Game.gameStates.INSIDE_ZONE);
        return this.showPopupContent(UtilsAppfurnace.getPage('Popup.onZoneMoveIn'));
      }
    };

    Game.prototype.onZoneMoveOut = function() {
      var state;
      state = this.getState();
      if (state !== Game.gameStates.INSIDE_ZONE) {
        return this.showPopupContent(UtilsAppfurnace.getPage('Popup.onZoneMoveOut'));
      } else {
        return this.setState(Game.gameStates.OUTSIDE_ZONE);
      }
    };

    Game.prototype.onStartPointMoveIn = function() {
      var self, state;
      self = this;
      state = this.getState();
      if (state === Game.gameStates.INSIDE_ZONE || state === Game.gameStates.OUTSIDE_ZONE) {
        this.setState(Game.gameStates.ON_STARTPOINT);
        return this.showPopupContent(UtilsAppfurnace.getPage('Popup.onStartPointMoveIn')).done(function($popupContent) {
          var $btn;
          $btn = UtilsAppfurnace.getUIElementByName('ui.btn.GameStart', $popupContent);
          return $btn.click(function() {
            return self.startGame();
          });
        });
      } else if (state === Game.gameStates.TIMER_END) {
        this.channel.channel.trigger('client-gameFinisched', {
          data: ''
        });
        return this.onGameFinisched();
      }
    };

    Game.prototype.onStartPointMoveOut = function() {};

    Game.prototype.setState = function(state) {
      return this.gameState = state;
    };

    Game.prototype.getState = function() {
      return this.gameState;
    };

    Game.prototype.startGame = function() {
      if (this.channel.channel.trigger("client-startGame", {
        data: "myData"
      })) {
        return this.onGameStart();
      }
    };

    return Game;

  })();
  ui.map.karte1.showFunction(Game.onMapClick);
  ui.map.karte2.showFunction(Game.onMapClick);
  return Game;
});

//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzpcXFVzZXJzXFxTdGVmYW5cXFNreURyaXZlXFxFbnR3aWNrbHVuZ1xcV2Vic3Rvcm1Qcm9qZWN0c1xcUk9MIC0gUlVOIE9SIExPU0VcXHB1YmxpY1xcamF2YXNjcmlwdHNcXGFwcFxcZ2FtZXBsYXlcXEdhbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXFN0ZWZhblxcU2t5RHJpdmVcXEVudHdpY2tsdW5nXFxXZWJzdG9ybVByb2plY3RzXFxST0wgLSBSVU4gT1IgTE9TRVxcYXNzZXRzXFxqYXZhc2NyaXB0c1xcYXBwXFxnYW1lcGxheVxcR2FtZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTt3SkFBQTs7QUFBQSxDQUFBLENBQ1EsQ0FRUixFQUFBLENBVEEsQ0FTQSxDQVRPLENBQUEsS0FBQSxDQVNQLENBVE8sSUFBQSxRQVNQLENBVE8sYUFBQTtDQVlMLEdBQUEsRUFBQTtDQUFBLENBQU07Q0FHSixFQUFjLENBQWQsTUFBQTtDQUFjLENBQ0MsSUFBYixLQUFBO0NBRFksQ0FFRyxJQUFmLE9BQUE7Q0FGWSxDQUdFLElBQWQsTUFBQTtDQUhZLENBS0gsSUFBVCxDQUFBO0NBTFksQ0FNUSxJQUFwQixZQUFBO0NBTlksQ0FPRCxJQUFYLEdBQUE7Q0FQWSxDQVFILElBQVQsRUFBQTtDQVJGLEtBQUE7O0NBQUEsRUFZZSxDQUFmLE9BQUE7O0NBWkEsRUFnQmEsQ0FBYixLQUFhLENBQWI7Q0FDRSxHQUFHLENBQW9CLENBQXZCLEtBQUc7Q0FHRCxHQUFJLEdBQUosQ0FBQSxHQUFnQjtRQUhsQjtDQUFBLEVBS3VCLENBQW5CLEVBQUosS0FBQTtDQUVRLENBQWlCLENBQXpCLENBQXdDLEdBQWpDLEVBQUssRUFBQSxFQUFaO0NBeEJGLElBZ0JhOztDQVdBLEVBQUEsQ0FBQSxDQUFBLFNBQUM7Q0FDWiw0Q0FBQTtDQUFBLDBDQUFBO0NBQUEsMENBQUE7Q0FBQSxnRUFBQTtDQUFBLDhEQUFBO0NBQUEsb0RBQUE7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NkQsQ0FBdEQsQ0FBUCxNQUFBLEdBQU8sRUFBZSxHQUFmO0NBQ0YsRUFBTSxDQUFQLENBQUosSUFBVyxRQUFYO0NBQ08sR0FBRCxLQUFKLFVBQUE7Q0FERixVQUFXO0NBRmIsUUFBNEU7Q0FNeEQsR0FBZCxDQUFBLENBUlIsRUFBQSxDQUFBLENBUWdDO0NBQzlCLENBQWdELEVBQS9DLEdBQU8sQ0FBUixjQUFBO0NBQWdELENBQU0sRUFBTixNQUFBO0NBQWhELFNBQUE7Q0FDQyxHQUFBLFdBQUQ7UUFkZ0I7Q0E1UHBCLElBNFBvQjs7Q0E1UHBCLEVBZ1JxQixNQUFBLFVBQXJCOztDQWhSQSxFQXVSVSxFQUFBLEdBQVYsQ0FBVztDQUNSLEVBQVksQ0FBWixLQUFELElBQUE7Q0F4UkYsSUF1UlU7O0NBdlJWLEVBNlJVLEtBQVYsQ0FBVTtDQUFNLEdBQUEsU0FBRDtDQTdSZixJQTZSVTs7Q0E3UlYsRUFrU1csTUFBWDtDQUNFLENBQWdELEVBQTdDLEVBQUgsQ0FBVyxXQUFSO0NBQTZDLENBQU8sRUFBTixJQUFBO0NBQWpELE9BQUc7Q0FDQSxHQUFBLE9BQUQsSUFBQTtRQUZPO0NBbFNYLElBa1NXOztDQWxTWDs7Q0FIRjtDQUFBLENBNFNBLENBQU0sQ0FBeUIsRUFBbEIsSUFBYixFQUFBO0NBNVNBLENBNlNBLENBQU0sQ0FBeUIsRUFBbEIsSUFBYixFQUFBO0NBRUEsR0FBQSxLQUFPO0NBbFRUIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lIFsncmVxdWlyZScsXHJcbiAgICAgICAgJ2Jhc2VDbGFzc2VzL1JlYWxUaW1lQ29tbXVuaWNhdGlvbkNoYW5uZWwnXHJcbiAgICAgICAgJ2pxdWVyeS1wb3B1cCcsXHJcbiAgICAgICAgJ2pxdWVyeScsXHJcbiAgICAgICAgJ2dhbWVwbGF5L0dhbWVmaWVsZCcsXHJcbiAgICAgICAgJ2Jhc2VDbGFzc2VzL1V0aWxzQXBwZnVybmFjZScsXHJcbiAgICAgICAgJ21vbWVudCcsXHJcbiAgICAgICAgJ2dhbWVwbGF5L0pva2VyJ10sXHJcblxyXG4ocmVxdWlyZSxSZWFsVGltZUNvbW11bmljYXRpb25DaGFubmVsLCB1bnVzZWQsICQsR2FtZWZpZWxkLFV0aWxzQXBwZnVybmFjZSxtb21lbnQsSm9rZXIpLT5cclxuICAjQGNsYXNzXHJcbiAgI0BkZXNjIFRoZSBtYWluIGdhbWUgY2xhc3NcclxuICBjbGFzcyBHYW1lXHJcbiAgICAjQHN0YXRpY1xyXG4gICAgI0B0eXAgZW51bVxyXG4gICAgQGdhbWVTdGF0ZXMgPSB7XHJcbiAgICAgIElOU0lERV9aT05FOiAxMCAjV2F0aW5nIGZvciBwbGF5ZXIgdG8gZW50ZXIgem9uZVxyXG4gICAgICBPTl9TVEFSVFBPSU5UOiAyMCAjV2FpdGluZyByZWFjaCB0aGUgcG9pbnRcclxuICAgICAgT1VUU0lERV9aT05FOiAzMCAjUGxheWVyIG1vdmUgb3V0IHRoZSBwbGF5Z3JvdW5kIC8gem9uZVxyXG5cclxuICAgICAgU1RBUlRFRDogNDBcclxuICAgICAgV0FJVElOR19GT1JfUExBWUVSOiA1MCAjTmV0d29yayBjb25uZWN0aW9uIGVycm9yXHJcbiAgICAgIFRJTUVSX0VORDogNTVcclxuICAgICAgRklOSVNIRUQ6NjBcclxuICAgIH1cclxuICAgICNAc3RhdGljXHJcbiAgICAjQGRlc2MgY3VycmVudCBHYW1lXHJcbiAgICBAY3VycmVudEdhbWUgPSBudWxsXHJcblxyXG4gICAgI0BzdGF0aWNcclxuICAgICNAZGVzYyBjYWxlZCBieSBjbGlja2luZyBvbiBhIG1hcFxyXG4gICAgQG9uTWFwQ2xpY2s6ICgpLT5cclxuICAgICAgaWYgR2FtZS5jdXJyZW50R2FtZSAhPSBudWxsXHJcbiAgICAgICNEZXN0cm95IC8gQ2FuY2xlIGdhbWVcclxuICAgICAgI0B0b2RvIEFrcyB1c2VyIHRvIGNhbmNsZSB0aGUgb3RoZXIgZ2FtZVxyXG4gICAgICAgIEdhbWUuY3VycmVudEdhbWUuZGVzdHJveSgpXHJcblxyXG4gICAgICBHYW1lLmN1cnJlbnRHYW1lID0gbmV3IEdhbWUodGhpcy5uYW1lKCkpXHJcbiAgICAgICNEbyBzb21ldGhpbmcgd2l0aCB0aGUgcGxheWVyXHJcbiAgICAgIGNvbnNvbGUubG9nKFsnb25NYXBTaG93Jyxhcmd1bWVudHMsIHRoaXMudWlkKCldKVxyXG5cclxuICAgICNAY29uc3RydWN0b3JcclxuICAgIGNvbnN0cnVjdG9yOiAobWFwSWQpLT5cclxuICAgICAgc2VsZiA9IEBcclxuICAgICAgQHNldFN0YXRlKEdhbWUuZ2FtZVN0YXRlcy5PVVRTSURFX1pPTkUpXHJcblxyXG5cclxuICAgICAgI0Bwcml2YXRlXHJcbiAgICAgICNAdHlwZSBwb3B1cCBmb3IgZ2FtZVxyXG4gICAgICBAJHBvcHVwID0gJChcIjxkaXYgY2xhc3M9J3BvcHVwJz48L2Rpdj5cIilcclxuICAgICAgJChcImJvZHlcIikuYXBwZW5kKEAkcG9wdXApXHJcbiAgICAgIEAkcG9wdXAucG9wdXAod2lkdGg6ICQod2luZG93KS53aWR0aCgpICogMC44LCBoZWlnaHQ6IDE1MClcclxuXHJcbiAgICAgICNAcHJpdmF0ZVxyXG4gICAgICAjQHR5cGUgZGVjaW1hbFxyXG4gICAgICBAY29pbnMgPSAwLjBcclxuXHJcbiAgICAgICNAcHJpdmF0ZVxyXG4gICAgICAjQHR5cGU6IEpva2VyXHJcbiAgICAgICNAZGVmYXVsdDogbnVsbFxyXG4gICAgICBAY3VycmVudEpva2VyID0gbnVsbFxyXG5cclxuICAgICAgI0Bwcml2YXRlXHJcbiAgICAgICNAdHlwZSBpbnRcclxuICAgICAgQHBsYXllckNvdW50ID0gMFxyXG4gICAgICBAbmFtZSA9IG1hcElkLnJlcGxhY2UoXCIgXCIsXCJcIik7XHJcblxyXG4gICAgICBAZ2FtZWZpZWxkID0gbmV3IEdhbWVmaWVsZChAbmFtZSlcclxuICAgICAgQGdhbWVmaWVsZC5zZXRab25lTW92ZUluKEBvblpvbmVNb3ZlSW4pXHJcbiAgICAgIEBnYW1lZmllbGQuc2V0U3RhcnRQb2ludE1vdmVJbihAb25TdGFydFBvaW50TW92ZUluKVxyXG5cclxuICAgICAgQGdhbWVmaWVsZC5zZXRab25lTW92ZU91dChAb25ab25lTW92ZU91dClcclxuICAgICAgQGdhbWVmaWVsZC5zZXRTdGFydFBvaW50TW92ZU91dChAb25TdGFydFBvaW50TW92ZU91dClcclxuICAgICAgQGdhbWVmaWVsZC5zZXRBbGxQb2ludHNNb3ZlSW4oQG9uR2FtZVBvaW50TW92ZUluKVxyXG5cclxuXHJcbiAgICAgIEBnYW1lZmllbGQuZGlzcGxheVBvaW50KEBnYW1lZmllbGQuZ2V0U3RhcnRQb2ludCgpKTtcclxuICAgICAgI0Bwcml2YXRlXHJcbiAgICAgICNAdHlwZSB0aW1lIGluIG1zXHJcbiAgICAgIEByZW1haW5pbmdUaW1lID0gQGdhbWVmaWVsZC5nZXREZWZhdWx0VGltZSgpXHJcblxyXG5cclxuICAgICAgI0FkZCBCaW5pbmdzXHJcbiAgICAgIEBjaGFubmVsID0gbmV3IFJlYWxUaW1lQ29tbXVuaWNhdGlvbkNoYW5uZWwoJ3ByZXNlbmNlLScrQG1hcClcclxuICAgICAgQGNoYW5uZWwuY2hhbm5lbFN1YnNjcmlwdGlvbi5kb25lICgpLT5cclxuICAgICAgICBzZWxmLmNoYW5uZWwuY2hhbm5lbC5iaW5kKFwicHVzaGVyOm1lbWJlcl9hZGRlZFwiLCBzZWxmLm9uUGxheWVySm9pbilcclxuICAgICAgICBzZWxmLmNoYW5uZWwuY2hhbm5lbC5iaW5kKFwicHVzaGVyOm1lbWJlcl9yZW1vdmVkXCIsIHNlbGYub25QbGF5ZXJMZWZ0KVxyXG4gICAgICAgIHNlbGYuY2hhbm5lbC5jaGFubmVsLmJpbmQoXCJjbGllbnQtc3RhcnRHYW1lXCIsIHNlbGYub25HYW1lU3RhcnQpXHJcbiAgICAgICAgc2VsZi5jaGFubmVsLmNoYW5uZWwuYmluZChcImNsaWVudC1nYW1lRmluaXNjaGVkXCIsIHNlbGYub25HYW1lRmluaXNjaGVkKVxyXG5cclxuICAgICAgI0FkZCBVSS1CaW5kaW5nc1xyXG4gICAgICBAZ2FtZWZpZWxkLmdldEpva2VyTm9kZSgpLmNsaWNrKEBvbkN1cnJlbnRKb2tlckNsaWNrKVxyXG5cclxuXHJcbiAgICAjQG1ldGhvZFxyXG4gICAgI0Bwcml2YXRlXHJcbiAgICAjQGRlc2M6IFN0YXJ0IHRoZSBpbnRlcm5hbCB0aW1lciBhbmQgdXBkYXRlIGV2ZXJ5IGludGVydmFsIHRoZSBkaXNwbGF5XHJcbiAgICBzdGFydFRpbWVyOiAoKT0+XHJcbiAgICAgIHN0YXJ0VGltZSA9IG1vbWVudCgpXHJcbiAgICAgIHNlbGYgPSBAXHJcbiAgICAgIHRpbWVyICAgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCktPlxyXG4gICAgICAgIHNlbGYucmVtYWluaW5nVGltZSA9IHNlbGYucmVtYWluaW5nVGltZSAtICAxMDAwXHJcbiAgICAgICAgaWYgc2VsZi5yZW1haW5pbmdUaW1lIDw9IDBcclxuICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpXHJcbiAgICAgICAgICBzZWxmLnJlbWFpbmluZ1RpbWUgPSAwXHJcbiAgICAgICAgICBzZWxmLm9uVGltZXJFbmQoKVxyXG4gICAgICAgIHNlbGYuZ2FtZWZpZWxkLmdldFRpbWVyTm9kZSgpLmh0bWwoXCJaZWl0OiBcIittb21lbnQoc2VsZi5yZW1haW5pbmdUaW1lKS5mb3JtYXQoXCJtbTpzc1wiKSlcclxuXHJcbiAgICAgICwxMDAwKVxyXG5cclxuICAgICNAbWV0aG9kXHJcbiAgICAjQHByaWF0ZVxyXG4gICAgI0BwYXJtcyB7alF1ZXJ5LkVsZW1lbXQgfCBzdHJpbmd9ICRlbFxyXG4gICAgI0ByZXR1bnMge2pRdWVyeS5Qcm9taXNlfVxyXG4gICAgc2hvd1BvcHVwQ29udGVudDogKCRlbCkgPT5cclxuICAgICAgI0NvdmVyIHRoZSBvbGQgdmlld3NcclxuICAgICAgaWYgQCRwb3B1cC5jaGlsZHJlbigpLmxlbmd0aCA+IDBcclxuICAgICAgICBVdGlsc0FwcGZ1cm5hY2Uuc3RvcmVQYWdlKEAkcG9wdXAuY2hpbGRyZW4oKS5maXJzdCgpKVxyXG5cclxuICAgICAgQCRwb3B1cC5odG1sKCRlbCkjUmVwbGFjZSBjb25lbnRcclxuICAgICAgZGZyID0galF1ZXJ5LkRlZmVycmVkKClcclxuICAgICAgJHBvcHVwID0gQCRwb3B1cCAjQ29udmVydCB0byBsb2NhbCB2YXJcclxuICAgICAgQCRwb3B1cC5kYXRhKCdwb3B1cCcpLm8uYWZ0ZXJPcGVuID0gKCktPiBkZnIucmVzb2x2ZSgkKFwiYm9keVwiKS5maW5kKFwiLnBvcHVwX2NvbnRcIikuZmlyc3QoKSlcclxuICAgICAgQCRwb3B1cC5kYXRhKCdwb3B1cCcpLm8uYWZ0ZXJDbG9zZSA9ICgpLT5cclxuICAgICAgICBpZiAkcG9wdXAuY2hpbGRyZW4oKS5sZW5ndGggPiAwXHJcbiAgICAgICAgICBVdGlsc0FwcGZ1cm5hY2Uuc3RvcmVQYWdlKCRwb3B1cC5jaGlsZHJlbigpLmZpcnN0KCkpXHJcblxyXG4gICAgICBAJHBvcHVwLmRhdGEoJ3BvcHVwJykub3BlbihAJHBvcHVwKSNTaG93IHBvcHVwXHJcbiAgICAgIHJldHVybiBkZnIucHJvbWlzZSgpXHJcblxyXG5cclxuICAgICNAbWVodG9kXHJcbiAgICAjQGRlc2M6IEZpcmVzIHdoZW4gdGhlIHBsYXllciBtb3ZlIGluIGEgam9rZXIgcG9pbnQsIHdoaWxlIHRoZSBnYW1lIGlzIHJ1bm5pbmdcclxuICAgIG9uR2FtZVBvaW50TW92ZUluOiAoY29vcmQpPT5cclxuICAgICAgcG9pbnQgPSBAZ2FtZWZpZWxkLmdldFBvaW50QnlDb29yZChjb29yZClcclxuICAgICAgdHlwZSA9IEBnYW1lZmllbGQuZ2V0UG9pbnRUeXBlTmFtZShwb2ludC5nZXROYW1lKCkpXHJcblxyXG4gICAgICAjQ2hlY2sgaWYgcG9pbnQgaXMgdmlzaWJsZSwgYW5kIGdhbWUgbXVzc3Qgc3RhcnRldFxyXG4gICAgICBnYW1lU3RhdGUgPSBAZ2V0U3RhdGUoKVxyXG4gICAgICBpZiBwb2ludCBpbiBAZ2FtZWZpZWxkLmdldFZpc2libGVQb2ludHMoKSBhbmQgKGdhbWVTdGF0ZSA9PSBHYW1lLmdhbWVTdGF0ZXMuU1RBUlRFRCBvciBnYW1lU3RhdGUgPT0gR2FtZS5nYW1lU3RhdGVzLldBSVRJTkdfRk9SX1BMQVlFUilcclxuICAgICAgICBAaW5jcmVtZW50Q29pbnMoQGdhbWVmaWVsZC5nZXRDb2luUGF5bWVudHMoKSlcclxuXHJcbiAgICAgICAgaWYgdHlwZSA9PSBHYW1lZmllbGQucG9pbnRUeXBlcy5DT0lOXHJcbiAgICAgICAgICBAb25Db2luUG9pbnRNb3ZlSW4oKVxyXG4gICAgICAgIGVsc2UgaWYgdHlwZSA9PSBHYW1lZmllbGQucG9pbnRUeXBlcy5KT0tFUlxyXG4gICAgICAgICAgQG9uSm9rZXJQb2ludE1vdmVJbigpXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5kZXJrbm93IHBvaW50IFR5cGVcIilcclxuXHJcbiAgICAjQG1ldGhvZDpcclxuICAgICNAZGVzYzogRmlyZXMgd2hlbiB0aGUgdXNlciB0YXAgdGhlIHVpLmJ0bi5jdXJyZW50Sm9rZXIgKHJpZ2h0IHRvcCBjb3JuZXIpXHJcbiAgICBvbkN1cnJlbnRKb2tlckNsaWNrOiAoKT0+XHJcbiAgICAgIHNlbGYgPSBAXHJcbiAgICAgIGlmIEBjdXJyZW50Sm9rZXIgPT0gbnVsbFxyXG4gICAgICAgIEBzaG93UG9wdXBDb250ZW50KFV0aWxzQXBwZnVybmFjZS5nZXRQYWdlKFwiUG9wdXAub25DdXJyZW50Sm9rZXJDbGlja05vSm9rZXJcIikpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBAc2hvd1BvcHVwQ29udGVudChVdGlsc0FwcGZ1cm5hY2UuZ2V0UGFnZShcIlBvcHVwLm9uQ3VycmVudEpva2VyQ2xpY2tcIikpLmRvbmUgKCRjb250ZW50KS0+XHJcbiAgICAgICAgICBVdGlsc0FwcGZ1cm5hY2UuZ2V0VUlFbGVtZW50QnlOYW1lKFwidWkubGFiZWwuam9rZXJEZXNjcmlwdGlvblwiLCRjb250ZW50KS5odG1sKHNlbGYuY3VycmVudEpva2VyLmdldERlc2NyaXB0aW9uKCkpXHJcbiAgICAgICAgICBVdGlsc0FwcGZ1cm5hY2UuZ2V0VUlFbGVtZW50QnlOYW1lKFwidWkuYnRuLmpva2VyQXBwbHlcIiwkY29udGVudCkuY2xpY2soc2VsZi5jdXJyZW50Sm9rZXIuYXBwbHlFZmZla3QpXHJcblxyXG5cclxuICAgICNAbWV0aG9kXHJcbiAgICAjQHByaWF0ZVxyXG4gICAgI0BkZXNjOiBTZXQgdGhlIEBjb2luIHZhciBhbmQgdXBkYXRlIFVJXHJcbiAgICAjQHBhcmFtOiB7aW50fSBpbmNyZW1lbnRcclxuICAgIGluY3JlbWVudENvaW5zOiAoaW5jcmVtZW50KT0+XHJcbiAgICAgIEBjb2lucyArPSBpbmNyZW1lbnRcclxuICAgICAgQGdhbWVmaWVsZC5nZXRDb2luTm9kZSgpLmh0bWwoXCJNw7xuemVuOiBcIitAY29pbnMpXHJcblxyXG4gICAgI0BtZXRob2RcclxuICAgICNAcHJpYXRlXHJcbiAgICAjQGRlc2M6IEZpcmVzIHdoZW4gdGhlIHVzZXIgcmVhY2ggYSBjb2luIHBvaW50XHJcbiAgICBvbkNvaW5Qb2ludE1vdmVJbjogKCk9PlxyXG4gICAgICBAZ2FtZWZpZWxkLmRpc3BsYXlOZXh0Um91bmQoKVxyXG4gICAgICBAc2hvd1BvcHVwQ29udGVudChVdGlsc0FwcGZ1cm5hY2UuZ2V0UGFnZShcIlBvcHVwLm9uQ29pblBvaW50TW92ZUluXCIpKVxyXG5cclxuICAgICNAbWV0aG9kXHJcbiAgICAjQHByaWF0ZVxyXG4gICAgI0BkZXNjOiBGaXJlcyB3aGVuIHRoZSB1c2VyIHJlYWNoIGEgam9rZXIgcG9pbnRcclxuICAgIG9uSm9rZXJQb2ludE1vdmVJbjogKCk9PlxyXG4gICAgICAkY3VycmVudEpva2VyID0gQGdhbWVmaWVsZC5nZXRKb2tlck5vZGUoKVxyXG4gICAgICBuZXdKb2tlciA9IEpva2VyLmdldFJhbmRvbUpva2VyKClcclxuICAgICAgQHNob3dQb3B1cENvbnRlbnQoVXRpbHNBcHBmdXJuYWNlLmdldFBhZ2UoXCJQb3B1cC5vbkpva2VyUG9pbnRNb3ZlSW5cIikpXHJcblxyXG4gICAgICAjQW5uaW1hdGUgYWxsIGpva2VyIHR5cGVzXHJcbiAgICAgIGkgPSAwXHJcbiAgICAgICNAZGVzYzogSGVscGVyIEZ1bmN0aW9uLCBhbm5pbWF0ZXMgYWxsIGpva2VyIHR5cGVzXHJcbiAgICAgIGFubmltYXRlQWxsSm9rZXJUeXBlcyA9ICgkbm9kZSktPlxyXG4gICAgICAgIGRmciA9ICQuRGVmZXJyZWQoKVxyXG4gICAgICAgIEpva2VyLmFuaW1hdGVJbWdhZ2VOb2RlKCRub2RlLEpva2VyLmpva2VyVHlwZXMuU1RFQUxfQ09JTlMpLmRvbmUgKCktPlxyXG4gICAgICAgICAgICBKb2tlci5hbmltYXRlSW1nYWdlTm9kZSgkbm9kZSxKb2tlci5qb2tlclR5cGVzLlNURUFMX1RJTUUpLmRvbmUgKCktPlxyXG4gICAgICAgICAgICAgIGlmIGkgIT0gMlxyXG4gICAgICAgICAgICAgICAgYW5uaW1hdGVBbGxKb2tlclR5cGVzKCRub2RlKVxyXG4gICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGRmci5yZXNvbHZlKCkjYWxsIGFubmltYXRpb25zIGRvbmVcclxuICAgICAgICAgICAgICBpKz0xXHJcbiAgICAgICAgcmV0dXJuIGRmci5wcm9taXNlKClcclxuXHJcbiAgICAgICNzdGFydCBhbm5pbWF0aW9uXHJcbiAgICAgIGFubmltYXRlQWxsSm9rZXJUeXBlcygkY3VycmVudEpva2VyKS5kb25lICgpLT5cclxuICAgICAgICBKb2tlci5hbmltYXRlSW1nYWdlTm9kZSgkY3VycmVudEpva2VyLG5ld0pva2VyLmdldFR5cGUoKSkjc2V0IHRoZSByYW5kb20gam9rZXJcclxuXHJcbiAgICAgIEBjdXJyZW50Sm9rZXIgPSBuZXdKb2tlclxyXG5cclxuICAgICNAbWV0aG9kXHJcbiAgICAjQHByaWF0ZVxyXG4gICAgI0BkZXNjOiBGaXJlcyBpZiB0aW1lciAgPT0gMFxyXG4gICAgb25UaW1lckVuZDogKCk9PlxyXG4gICAgICBAc2V0U3RhdGUoR2FtZS5nYW1lU3RhdGVzLlRJTUVSX0VORClcclxuICAgICAgQGdhbWVmaWVsZC5oaWRlUG9pbnRzKEBnYW1lZmllbGQuZ2V0VmlzaWJsZVBvaW50cygpKSNIaWRlIGN1cnJlbnQgcG9pbnRzXHJcbiAgICAgIEBnYW1lZmllbGQuZGlzcGxheVBvaW50KEBnYW1lZmllbGQuZ2V0U3RhcnRQb2ludCgpKSAjc2hvdyBzdGFydCBwb2ludFxyXG4gICAgICBAc2hvd1BvcHVwQ29udGVudChVdGlsc0FwcGZ1cm5hY2UuZ2V0UGFnZShcIlBvcHVwLm9uVGltZXJFbmRcIikpXHJcblxyXG4gICAgI0BtZXRob2RcclxuICAgICNAcHJpdmF0ZVxyXG4gICAgI0BldmVudFxyXG4gICAgb25QbGF5ZXJKb2luOiAoKT0+XHJcbiAgICAgIEBwbGF5ZXJDb3VudCArPSAxXHJcbiAgICAgIHBvcHVwKFwiRWluIFNwaWVsZXIgaGF0IGRhcyBTcGllbGZlbGQgYmV0cmV0ZW5cIilcclxuXHJcbiAgICAjQG1ldGhvZFxyXG4gICAgI0Bwcml2YXRlXHJcbiAgICAjQGV2ZW50XHJcbiAgICBvblBsYXllckxlZnQ6ICgpPT5cclxuICAgICAgQHBsYXllckNvdW50IC09IDFcclxuICAgICAgcG9wdXAoXCJFaW4gU3BpZWxlciBoYXQgZGFzIFNwaWVsZmVsZCB2ZXJsYXNzZW5cIilcclxuXHJcbiAgICAjQG1ldGhvZFxyXG4gICAgI0Bwcml2YXRlXHJcbiAgICAjQGV2ZW50XHJcbiAgICBvbkdhbWVTdGFydDogKCk9PlxyXG4gICAgICBAc2V0U3RhdGUoR2FtZS5nYW1lU3RhdGVzLlNUQVJURUQpXHJcbiAgICAgIEBzdGFydFRpbWVyKClcclxuICAgICAgQGluY3JlbWVudENvaW5zKDApI1VwZGF0ZSBVSS1Pbmx5XHJcbiAgICAgIEBnYW1lZmllbGQuZGlzcGxheU5leHRSb3VuZCgpXHJcbiAgICAgIEBzaG93UG9wdXBDb250ZW50KFV0aWxzQXBwZnVybmFjZS5nZXRQYWdlKFwiUG9wdXAub25HYW1lU3RhcnRcIikpXHJcblxyXG4gICAgI0BtZXRob2RcclxuICAgICNAcHJpdmF0ZVxyXG4gICAgI0BldmVudFxyXG4gICAgb25HYW1lRmluaXNjaGVkOiAoKT0+XHJcbiAgICAgIEBzZXRTdGF0ZShHYW1lLmdhbWVTdGF0ZXMuRklOSVNIRUQpXHJcbiAgICAgIEBzaG93UG9wdXBDb250ZW50KFV0aWxzQXBwZnVybmFjZS5nZXRQYWdlKFwiUG9wdXAub25HYW1lRmluaXNjaGVkXCIpKVxyXG5cclxuXHJcbiAgICAjQG1ldGhvZFxyXG4gICAgI0Bwcml2YXRlXHJcbiAgICAjQGV2ZW50XHJcbiAgICBvblpvbmVNb3ZlSW46ICgpPT5cclxuICAgICAgaWYgQGdhbWVTdGF0ZSA9PSBHYW1lLmdhbWVTdGF0ZXMuT1VUU0lERV9aT05FXHJcbiAgICAgICAgQHNldFN0YXRlKEdhbWUuZ2FtZVN0YXRlcy5JTlNJREVfWk9ORSlcclxuICAgICAgICBAc2hvd1BvcHVwQ29udGVudChVdGlsc0FwcGZ1cm5hY2UuZ2V0UGFnZSgnUG9wdXAub25ab25lTW92ZUluJykpXHJcblxyXG4gICAgI0BtZXRob2RcclxuICAgICNAcHJpdmF0ZVxyXG4gICAgI0BldmVudFxyXG4gICAgb25ab25lTW92ZU91dDogKCk9PlxyXG4gICAgICBzdGF0ZSA9IEBnZXRTdGF0ZSgpXHJcbiAgICAgIGlmIHN0YXRlICE9IEdhbWUuZ2FtZVN0YXRlcy5JTlNJREVfWk9ORVxyXG4gICAgICAgIEBzaG93UG9wdXBDb250ZW50KFV0aWxzQXBwZnVybmFjZS5nZXRQYWdlKCdQb3B1cC5vblpvbmVNb3ZlT3V0JykpXHJcbiAgICAgIGVsc2UgI3N0YXRlID09IElOU0lERV9aT05FXHJcbiAgICAgICAgQHNldFN0YXRlKEdhbWUuZ2FtZVN0YXRlcy5PVVRTSURFX1pPTkUpXHJcblxyXG5cclxuICAgICNAbWV0aG9kXHJcbiAgICAjQHByaXZhdGVcclxuICAgICNAZXZlbnRcclxuICAgIG9uU3RhcnRQb2ludE1vdmVJbjogKCk9PlxyXG4gICAgICBzZWxmID0gQFxyXG4gICAgICAjR2FtZSBzdGFydCBtZXNzYWdlXHJcbiAgICAgIHN0YXRlID0gQGdldFN0YXRlKClcclxuICAgICAgaWYgc3RhdGUgPT0gR2FtZS5nYW1lU3RhdGVzLklOU0lERV9aT05FIG9yIHN0YXRlID09IEdhbWUuZ2FtZVN0YXRlcy5PVVRTSURFX1pPTkVcclxuICAgICAgICBAc2V0U3RhdGUoR2FtZS5nYW1lU3RhdGVzLk9OX1NUQVJUUE9JTlQpXHJcbiAgICAgICAgQHNob3dQb3B1cENvbnRlbnQoVXRpbHNBcHBmdXJuYWNlLmdldFBhZ2UoJ1BvcHVwLm9uU3RhcnRQb2ludE1vdmVJbicpKS5kb25lICgkcG9wdXBDb250ZW50KSAtPlxyXG4gICAgICAgICAgJGJ0biA9IFV0aWxzQXBwZnVybmFjZS5nZXRVSUVsZW1lbnRCeU5hbWUoJ3VpLmJ0bi5HYW1lU3RhcnQnLCRwb3B1cENvbnRlbnQpI1VzZSB0aGUgcG9wdXAgY29udGVudCB0byBzZWFyY2hcclxuICAgICAgICAgICRidG4uY2xpY2soKCktPlxyXG4gICAgICAgICAgICBzZWxmLnN0YXJ0R2FtZSgpXHJcbiAgICAgICAgICApXHJcbiAgICAgICNHYW1lIGVuZCBtZXNzYWdlXHJcbiAgICAgIGVsc2UgaWYgc3RhdGUgPT0gR2FtZS5nYW1lU3RhdGVzLlRJTUVSX0VORFxyXG4gICAgICAgIEBjaGFubmVsLmNoYW5uZWwudHJpZ2dlcignY2xpZW50LWdhbWVGaW5pc2NoZWQnLGRhdGE6ICcnKVxyXG4gICAgICAgIEBvbkdhbWVGaW5pc2NoZWQoKVxyXG5cclxuXHJcbiAgICAjQG1ldGhvZFxyXG4gICAgI0Bwcml2YXRlXHJcbiAgICAjQGV2ZW50XHJcbiAgICBvblN0YXJ0UG9pbnRNb3ZlT3V0OiAoKT0+XHJcbiAgICAgICNDaGVjayBpZiBnYW1lIHN0YXRlZCBva2F5LCBlbHNlIGRpc3BsYXkgbWVzc2FnZVxyXG5cclxuICAgICNAbWVodG9kXHJcbiAgICAjQHByaXZhdGVcclxuICAgICNAZGVzIHNldCB0aGUgc3RhdGVzXHJcbiAgICAjQHBhcmFtIHtHYW1lLkdhbWVTdGF0ZXN9IHN0YXRlXHJcbiAgICBzZXRTdGF0ZTogKHN0YXRlKSA9PlxyXG4gICAgICBAZ2FtZVN0YXRlID0gc3RhdGVcclxuICAgICNAbWVodG9kXHJcbiAgICAjQHByaXZhdGVcclxuICAgICNAZGVzIGdldCB0aGUgc3RhdGVzXHJcbiAgICAjQHJldHVybiB7R2FtZS5HYW1lU3RhdGVzfSBAZ2FtZVN0YXRlXHJcbiAgICBnZXRTdGF0ZTogKCkgPT5AZ2FtZVN0YXRlXHJcblxyXG4gICAgI0BtZXRob2RcclxuICAgICNAcHVibGljXHJcbiAgICAjQGRlc2MgY2FsbGVkIG9uIHN0YXJ0IG9mIHRoZSBHYW1lXHJcbiAgICBzdGFydEdhbWU6ICgpPT5cclxuICAgICAgaWYgQGNoYW5uZWwuY2hhbm5lbC50cmlnZ2VyKFwiY2xpZW50LXN0YXJ0R2FtZVwiLCB7ZGF0YTogXCJteURhdGFcIn0pXHJcbiAgICAgICAgQG9uR2FtZVN0YXJ0KClcclxuXHJcblxyXG5cclxuICAjQWRkIGV2ZW50IHVpLWJpbmRpbmdzXHJcbiAgdWkubWFwLmthcnRlMS5zaG93RnVuY3Rpb24oR2FtZS5vbk1hcENsaWNrKVxyXG4gIHVpLm1hcC5rYXJ0ZTIuc2hvd0Z1bmN0aW9uKEdhbWUub25NYXBDbGljaylcclxuICAjUmV0dXJuIHRoZSBnYW1lIGNsYXNzXHJcbiAgcmV0dXJuIEdhbWVcclxuXHJcblxyXG4iXX0=
