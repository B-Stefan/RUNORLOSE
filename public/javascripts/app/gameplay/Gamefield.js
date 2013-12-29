var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['require', 'baseClasses/RealTimeCommunicationChannel', 'jquery-popup', 'jquery', "baseClasses/UtilsAppfurnace"], function(require, RealTimeCommunicationChannel, unused, $, UtilsAppfurnace) {
  var Gamefield;
  return Gamefield = (function() {
    Gamefield.pointTypes = {
      ZONE: 0,
      START: 10,
      COIN: 20,
      JOKER: 30
    };

    Gamefield.markerImages = {
      START: 'images/startpunktODERzielpunkt.png',
      COIN: 'images/checkpointMuenzen.png',
      JOKER: 'images/checkpointJoker.png'
    };

    function Gamefield(mapId) {
      this.getDefaultTime = __bind(this.getDefaultTime, this);
      this.getJokerNode = __bind(this.getJokerNode, this);
      this.getCoinNode = __bind(this.getCoinNode, this);
      this.getTimerNode = __bind(this.getTimerNode, this);
      this.setStartPointMoveOut = __bind(this.setStartPointMoveOut, this);
      this.setStartPointMoveIn = __bind(this.setStartPointMoveIn, this);
      this.setZoneMoveOut = __bind(this.setZoneMoveOut, this);
      this.setZoneMoveIn = __bind(this.setZoneMoveIn, this);
      this.userInsideZone = __bind(this.userInsideZone, this);
      this.hidePoints = __bind(this.hidePoints, this);
      this.hidePoint = __bind(this.hidePoint, this);
      this.displayPoints = __bind(this.displayPoints, this);
      this.displayPoint = __bind(this.displayPoint, this);
      this.getStartPoint = __bind(this.getStartPoint, this);
      this.displayNextRound = __bind(this.displayNextRound, this);
      this.getNextPoints = __bind(this.getNextPoints, this);
      this.getPointByName = __bind(this.getPointByName, this);
      this.getPointByCoord = __bind(this.getPointByCoord, this);
      this.getPoints = __bind(this.getPoints, this);
      this.getVisiblePoints = __bind(this.getVisiblePoints, this);
      this.setAllPointsMoveIn = __bind(this.setAllPointsMoveIn, this);
      this.stylePoints = __bind(this.stylePoints, this);
      this.getPointTypeName = __bind(this.getPointTypeName, this);
      this.getCoinPayments = __bind(this.getCoinPayments, this);
      this.name = mapId.replace(" ", "");
      this.zone = af.geoFeatures.getFeatureByName(this.name);
      this.startPoint = af.geoFeatures.getFeatureByName(this.name + '.Start');
      this.round = 1;
      this.points = af.geoFeatures.getFeatures();
      this.pointsDisplayed = Array();
      /*
      #@todo Remove zone... but this following code cause errors. Zone object => deleted; no events fire
      for point in @points
        if point.getName() == @name
          indexOfZone = @points.indexOf(point)
          @points.splice(indexOfZone, 1) #remove zone form array
          break #Breack because we find the zone
      */

      this.stylePoints();
    }

    Gamefield.prototype.getCoinPayments = function() {
      return 50;
    };

    Gamefield.prototype.getPointTypeName = function(string) {
      var str;
      str = string.substring(this.name.length + 1).toLowerCase();
      if (str === "") {
        return Gamefield.pointTypes.ZONE;
      } else if (str === 'start') {
        return Gamefield.pointTypes.START;
      } else if (str.substring(str.length - 1, str.length) === 'j') {
        return Gamefield.pointTypes.JOKER;
      } else if (str.indexOf('p') > -1) {
        return Gamefield.pointTypes.COIN;
      } else {
        throw new Error("We cant find a Gamefield.pointTpye for the string: " + string);
      }
    };

    Gamefield.prototype.stylePoints = function() {
      var point, type, _i, _len, _ref, _results;
      _ref = this.points;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        if (point.setMarkerImage) {
          type = this.getPointTypeName(point.getName());
          if (type === Gamefield.pointTypes.START) {
            _results.push(point.setMarkerImage(Gamefield.markerImages.START, 32, 46, "center", "center", false));
          } else if (type === Gamefield.pointTypes.COIN) {
            _results.push(point.setMarkerImage(Gamefield.markerImages.COIN, 32, 46, "center", "center", false));
          } else if (type === Gamefield.pointTypes.JOKER) {
            _results.push(point.setMarkerImage(Gamefield.markerImages.JOKER, 32, 46, "center", "center", false));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Gamefield.prototype.setAllPointsMoveIn = function(onGamePointMoveIn) {
      var point, type, _i, _len, _ref, _results;
      _ref = this.getPoints();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        type = this.getPointTypeName(point.getName());
        if (type !== Gamefield.pointTypes.START && type !== Gamefield.pointTypes.ZONE) {
          _results.push(point.setMovein(onGamePointMoveIn));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Gamefield.prototype.getVisiblePoints = function() {
      return this.pointsDisplayed;
    };

    Gamefield.prototype.getPoints = function() {
      return this.points;
    };

    Gamefield.prototype.getPointByCoord = function(coord) {
      var point, _i, _len, _ref;
      _ref = this.points;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        if (this.getPointTypeName(point.getName()) !== Gamefield.pointTypes.ZONE) {
          if (point.contains(coord)) {
            return point;
          }
        }
      }
      throw new Error("We cant find a point at coord: x:" + coord.x + "y:" + coord.y);
    };

    Gamefield.prototype.getPointByName = function(name) {
      var point, pointName, _i, _len, _ref;
      name = name.toLowerCase();
      _ref = this.points;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        pointName = point.getName();
        pointName = pointName.substring(this.name.length + 1).toLowerCase();
        pointName = pointName.replace("j", "");
        if (pointName === name) {
          return point;
        }
      }
      throw new Error("We cant find the point with the name: " + name);
    };

    Gamefield.prototype.getNextPoints = function() {
      var arr;
      arr = [this.getPointByName("P" + this.round + ".1"), this.getPointByName("P" + this.round + ".2")];
      this.round += 1;
      return arr;
    };

    Gamefield.prototype.displayNextRound = function() {
      var next;
      next = this.getNextPoints();
      this.hidePoints(this.getVisiblePoints());
      return this.displayPoints(next);
    };

    Gamefield.prototype.getStartPoint = function() {
      return this.getPointByName("Start");
    };

    Gamefield.prototype.displayPoint = function(point) {
      return this.displayPoints([point]);
    };

    Gamefield.prototype.displayPoints = function(points) {
      var point, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        point = points[_i];
        point.setMarkerVisible(true);
        _results.push(this.pointsDisplayed.push(point));
      }
      return _results;
    };

    Gamefield.prototype.hidePoint = function(point) {
      return this.hidePoints([point]);
    };

    Gamefield.prototype.hidePoints = function(points) {
      var point, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        point = points[_i];
        point.setMarkerVisible(false);
        _results.push(this.pointsDisplayed = this.pointsDisplayed.slice(this.pointsDisplayed.indexOf(point), 1));
      }
      return _results;
    };

    Gamefield.prototype.userInsideZone = function() {
      return this.zone.userInside();
    };

    Gamefield.prototype.setZoneMoveIn = function(handler) {
      return this.zone.setMovein(handler);
    };

    Gamefield.prototype.setZoneMoveOut = function(handler) {
      return this.zone.setMoveout(handler);
    };

    Gamefield.prototype.setStartPointMoveIn = function(handler) {
      return this.startPoint.setMovein(handler);
    };

    Gamefield.prototype.setStartPointMoveOut = function(handler) {
      return this.startPoint.setMoveout(handler);
    };

    Gamefield.prototype.getTimerNode = function() {
      return UtilsAppfurnace.getUIElementByName("ui.label.timer", UtilsAppfurnace.getPage(this.name)).find(".vcenterable").first();
    };

    Gamefield.prototype.getCoinNode = function() {
      return UtilsAppfurnace.getUIElementByName("ui.label.coins", UtilsAppfurnace.getPage(this.name)).find(".vcenterable").first();
    };

    Gamefield.prototype.getJokerNode = function() {
      return UtilsAppfurnace.getUIElementByName("ui.btn.currentJoker", UtilsAppfurnace.getPage(this.name)).find(".label").first();
    };

    Gamefield.prototype.getDefaultTime = function() {
      return 180000;
    };

    return Gamefield;

  })();
});

//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzpcXFVzZXJzXFxTdGVmYW5cXFNreURyaXZlXFxFbnR3aWNrbHVuZ1xcV2Vic3Rvcm1Qcm9qZWN0c1xcUk9MIC0gUlVOIE9SIExPU0VcXHB1YmxpY1xcamF2YXNjcmlwdHNcXGFwcFxcZ2FtZXBsYXlcXEdhbWVmaWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcU3RlZmFuXFxTa3lEcml2ZVxcRW50d2lja2x1bmdcXFdlYnN0b3JtUHJvamVjdHNcXFJPTCAtIFJVTiBPUiBMT1NFXFxhc3NldHNcXGphdmFzY3JpcHRzXFxhcHBcXGdhbWVwbGF5XFxHYW1lZmllbGQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsOEVBQUE7O0FBQUEsQ0FBQSxDQUFtQixDQUVuQixHQUZBLENBRUEsQ0FGTyxDQUFBLEtBQUEsQ0FFUCxhQUFBLENBRk8sYUFBQTtDQUlMLEtBQUEsR0FBQTtTQUFNO0NBR0osRUFDRSxDQURGLEtBQUMsQ0FBRDtDQUNFLENBQU0sRUFBTixFQUFBO0NBQUEsQ0FDTyxHQUFQLENBQUE7Q0FEQSxDQUVNLEVBQU4sRUFBQTtDQUZBLENBR08sR0FBUCxDQUFBO0NBSkYsS0FBQTs7Q0FBQSxFQVVFLENBREYsS0FBQyxHQUFEO0NBQ0UsQ0FBTyxHQUFQLENBQUEsOEJBQUE7Q0FBQSxDQUNNLEVBQU4sRUFBQSx3QkFEQTtDQUFBLENBRU8sR0FBUCxDQUFBLHNCQUZBO0NBVkYsS0FBQTs7Q0FjYSxFQUFBLENBQUEsQ0FBQSxjQUFDO0NBQ1osc0RBQUE7Q0FBQSxrREFBQTtDQUFBLGdEQUFBO0NBQUEsa0RBQUE7Q0FBQSxrRUFBQTtDQUFBLGdFQUFBO0NBQUEsc0RBQUE7Q0FBQSxvREFBQTtDQUFBLHNEQUFBO0NBQUEsOENBQUE7Q0FBQSw0Q0FBQTtDQUFBLG9EQUFBO0NBQUEsa0RBQUE7Q0FBQSxvREFBQTtDQUFBLDBEQUFBO0NBQUEsb0RBQUE7Q0FBQSxzREFBQTtDQUFBLHdEQUFBO0NBQUEsNENB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LENBQWxCLENBQWtCLEVBQXVCLFFBQTFDO0NBRkY7dUJBRFU7Q0FoS1osSUFnS1k7O0NBaEtaLEVBcUtnQixNQUFBLEtBQWhCO0NBQXNCLEdBQUEsTUFBRCxHQUFBO0NBcktyQixJQXFLZ0I7O0NBcktoQixFQXNLZSxJQUFBLEVBQUMsSUFBaEI7Q0FBNEIsR0FBQSxHQUFELEVBQUEsSUFBQTtDQXRLM0IsSUFzS2U7O0NBdEtmLEVBdUtnQixJQUFBLEVBQUMsS0FBakI7Q0FBNEIsR0FBQSxHQUFELEdBQUEsR0FBQTtDQXZLM0IsSUF1S2dCOztDQXZLaEIsRUF5S3FCLElBQUEsRUFBQyxVQUF0QjtDQUFrQyxHQUFBLEdBQUQsRUFBQSxDQUFXLEdBQVg7Q0F6S2pDLElBeUtxQjs7Q0F6S3JCLEVBMEtzQixJQUFBLEVBQUMsV0FBdkI7Q0FBbUMsR0FBQSxHQUFELEdBQVcsR0FBWDtDQTFLbEMsSUEwS3NCOztDQTFLdEIsRUEyS2MsTUFBQSxHQUFkO0NBQWtDLENBQW9DLEVBQXlCLENBQTdFLEVBQW9ELE1BQXBELENBQUEsQ0FBZSxDQUFmLEVBQUE7Q0EzS2xCLElBMktjOztDQTNLZCxFQTRLYSxNQUFBLEVBQWI7Q0FBa0MsQ0FBb0MsRUFBeUIsQ0FBN0UsRUFBb0QsTUFBcEQsQ0FBQSxDQUFlLENBQWYsRUFBQTtDQTVLbEIsSUE0S2E7O0NBNUtiLEVBNktjLE1BQUEsR0FBZDtDQUFtQyxDQUF5QyxFQUF5QixDQUFsRixFQUF5RCxDQUF6RCxLQUFBLEVBQWUsR0FBZixHQUFBO0NBN0tuQixJQTZLYzs7Q0E3S2QsRUFnTGdCLE1BQUEsS0FBaEI7Q0FBZ0IsWUFBSztDQWhMckIsSUFnTGdCOztDQWhMaEI7O0NBTEo7Q0FBQSIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSBbJ3JlcXVpcmUnLCAnYmFzZUNsYXNzZXMvUmVhbFRpbWVDb21tdW5pY2F0aW9uQ2hhbm5lbCdcclxuICAgICAgICAnanF1ZXJ5LXBvcHVwJywgJ2pxdWVyeScsIFwiYmFzZUNsYXNzZXMvVXRpbHNBcHBmdXJuYWNlXCJdLFxyXG4ocmVxdWlyZSxSZWFsVGltZUNvbW11bmljYXRpb25DaGFubmVsLCB1bnVzZWQsICQsVXRpbHNBcHBmdXJuYWNlKS0+XHJcblxyXG4gIGNsYXNzIEdhbWVmaWVsZFxyXG4gICAgI0BzdGF0aWNcclxuICAgICNAdHlwZTogZW51bVxyXG4gICAgQHBvaW50VHlwZXMgPVxyXG4gICAgICBaT05FOiAwXHJcbiAgICAgIFNUQVJUOiAxMFxyXG4gICAgICBDT0lOOiAyMFxyXG4gICAgICBKT0tFUjogMzBcclxuXHJcbiAgICAjQHN0YXRpY1xyXG4gICAgI0B0eXBlOiBlbnVtXHJcbiAgICAjQGRlc2M6IFRoZSByZWxhdGl2ZSBwYXRoIHRvIHRoZSBtYXJrZXIgaW1hZ2VzXHJcbiAgICBAbWFya2VySW1hZ2VzOlxyXG4gICAgICBTVEFSVDogJ2ltYWdlcy9zdGFydHB1bmt0T0RFUnppZWxwdW5rdC5wbmcnXHJcbiAgICAgIENPSU46ICdpbWFnZXMvY2hlY2twb2ludE11ZW56ZW4ucG5nJ1xyXG4gICAgICBKT0tFUjogJ2ltYWdlcy9jaGVja3BvaW50Sm9rZXIucG5nJ1xyXG5cclxuICAgIGNvbnN0cnVjdG9yOiAobWFwSWQpLT5cclxuICAgICAgQG5hbWUgPSBtYXBJZC5yZXBsYWNlKFwiIFwiLFwiXCIpI1JlcGxhY2UgYmxhbmtzXHJcblxyXG4gICAgICAjQHByaXZhdGVcclxuICAgICAgI0BkZXNjIHRoZSB6b25lIG9iamVjdCBhbiBnYW1lZmllbGQgYm9yZGVyc1xyXG4gICAgICAjQHRvZG8gRHluYW1pYyBab25lIG5hbWUgYnkgTWFwSURcclxuICAgICAgIyBTb21lIGlzc3VlcyB3aXRoIHRoZSB6b25lIG5hbWUuIEFsbCB6b25lcyBuYW1lZCBcInpvbmVcIiAuLi46KFxyXG4gICAgICAjQHByaXZhdGVcclxuICAgICAgQHpvbmUgPSBhZi5nZW9GZWF0dXJlcy5nZXRGZWF0dXJlQnlOYW1lKEBuYW1lKVxyXG4gICAgICAjQHByaXZhdGVcclxuICAgICAgQHN0YXJ0UG9pbnQgPSBhZi5nZW9GZWF0dXJlcy5nZXRGZWF0dXJlQnlOYW1lKEBuYW1lKycuU3RhcnQnKVxyXG5cclxuICAgICAgI0B0eXBlIGludFxyXG4gICAgICAjQGRlc2M6IFRoZSByb3VuZCBpbmRleCBmb3IgdGhpcyBnYW1lXHJcbiAgICAgIEByb3VuZCAgPSAxXHJcblxyXG5cclxuICAgICAgI0Bwcml2YXRlXHJcbiAgICAgICNAdHlwZSA8YWYuR2VvRmVhdHVyZT5BcnJheSgpXHJcbiAgICAgICNAZGVzYzogQ29udGFpbnMgYWxsIHBvaW50cyBmb3IgdGhpcyBnYW1lZmllbGRcclxuICAgICAgQHBvaW50cyA9IGFmLmdlb0ZlYXR1cmVzLmdldEZlYXR1cmVzKClcclxuXHJcbiAgICAgIEBwb2ludHNEaXNwbGF5ZWQgPSBBcnJheSgpXHJcblxyXG4gICAgICAjcmVtb3ZlIHpvbmUgZnJvbSBsaXN0XHJcbiAgICAgICMjI1xyXG4gICAgICAjQHRvZG8gUmVtb3ZlIHpvbmUuLi4gYnV0IHRoaXMgZm9sbG93aW5nIGNvZGUgY2F1c2UgZXJyb3JzLiBab25lIG9iamVjdCA9PiBkZWxldGVkOyBubyBldmVudHMgZmlyZVxyXG4gICAgICBmb3IgcG9pbnQgaW4gQHBvaW50c1xyXG4gICAgICAgIGlmIHBvaW50LmdldE5hbWUoKSA9PSBAbmFtZVxyXG4gICAgICAgICAgaW5kZXhPZlpvbmUgPSBAcG9pbnRzLmluZGV4T2YocG9pbnQpXHJcbiAgICAgICAgICBAcG9pbnRzLnNwbGljZShpbmRleE9mWm9uZSwgMSkgI3JlbW92ZSB6b25lIGZvcm0gYXJyYXlcclxuICAgICAgICAgIGJyZWFrICNCcmVhY2sgYmVjYXVzZSB3ZSBmaW5kIHRoZSB6b25lXHJcbiAgICAgICMjI1xyXG4gICAgICBAc3R5bGVQb2ludHMoKVxyXG5cclxuICAgICNAbWVodG9kXHJcbiAgICAjQGRlc2M6IFJldHVybnMgdGhlIHBheW1lbnQgaW4gY29pbnNcclxuICAgIGdldENvaW5QYXltZW50czogKCk9PlxyXG4gICAgICByZXR1cm4gNTBcclxuXHJcbiAgICAjQGRlc2M6IEdldCB0aGUgcG9pbnQgdHlwZSBieSBhIGNvbXBsZXRlIHN0cmluZ1xyXG4gICAgZ2V0UG9pbnRUeXBlTmFtZTogKHN0cmluZykgPT5cclxuICAgICAgc3RyID0gc3RyaW5nLnN1YnN0cmluZyhAbmFtZS5sZW5ndGgrMSkudG9Mb3dlckNhc2UoKVxyXG4gICAgICBpZiBzdHIgPT0gXCJcIlxyXG4gICAgICAgIHJldHVybiBHYW1lZmllbGQucG9pbnRUeXBlcy5aT05FICNWZXJ5IHVnbHkgYnV0IGFwcGZ1bnJhbmNlIGNhdXNlIHNvbWUgZXJyb3JzIGlmIEkgcmVtb3ZlIHRoZSB6b25lIGZvcm0gdGhlIHBvaW50TGlzdFxyXG4gICAgICBlbHNlIGlmIHN0ciA9PSAnc3RhcnQnXHJcbiAgICAgICAgcmV0dXJuIEdhbWVmaWVsZC5wb2ludFR5cGVzLlNUQVJUXHJcbiAgICAgIGVsc2UgaWYgIHN0ci5zdWJzdHJpbmcoc3RyLmxlbmd0aC0xLHN0ci5sZW5ndGgpID09ICdqJ1xyXG4gICAgICAgIHJldHVybiBHYW1lZmllbGQucG9pbnRUeXBlcy5KT0tFUlxyXG4gICAgICBlbHNlIGlmIHN0ci5pbmRleE9mKCdwJykgPiAtMVxyXG4gICAgICAgIHJldHVybiBHYW1lZmllbGQucG9pbnRUeXBlcy5DT0lOXHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXZSBjYW50IGZpbmQgYSBHYW1lZmllbGQucG9pbnRUcHllIGZvciB0aGUgc3RyaW5nOiBcIiArIHN0cmluZylcclxuXHJcbiAgICAjQG1ldGhvZFxyXG4gICAgI0BkZXNjOiBzdHlsZSBhbGwgcG9pbnRzXHJcbiAgICBzdHlsZVBvaW50czogKCk9PlxyXG4gICAgICBmb3IgcG9pbnQgaW4gQHBvaW50c1xyXG4gICAgICAgIGlmIHBvaW50LnNldE1hcmtlckltYWdlXHJcbiAgICAgICAgICB0eXBlID0gQGdldFBvaW50VHlwZU5hbWUocG9pbnQuZ2V0TmFtZSgpKVxyXG4gICAgICAgICAgaWYgdHlwZSA9PSBHYW1lZmllbGQucG9pbnRUeXBlcy5TVEFSVFxyXG4gICAgICAgICAgICBwb2ludC5zZXRNYXJrZXJJbWFnZShHYW1lZmllbGQubWFya2VySW1hZ2VzLlNUQVJULCAzMiwgNDYsIFwiY2VudGVyXCIsIFwiY2VudGVyXCIsZmFsc2UpXHJcbiAgICAgICAgICBlbHNlIGlmIHR5cGUgPT0gR2FtZWZpZWxkLnBvaW50VHlwZXMuQ09JTlxyXG4gICAgICAgICAgICBwb2ludC5zZXRNYXJrZXJJbWFnZShHYW1lZmllbGQubWFya2VySW1hZ2VzLkNPSU4sIDMyLCA0NiwgXCJjZW50ZXJcIiwgXCJjZW50ZXJcIixmYWxzZSlcclxuICAgICAgICAgIGVsc2UgaWYgdHlwZSA9PSBHYW1lZmllbGQucG9pbnRUeXBlcy5KT0tFUlxyXG4gICAgICAgICAgICBwb2ludC5zZXRNYXJrZXJJbWFnZShHYW1lZmllbGQubWFya2VySW1hZ2VzLkpPS0VSLCAzMiwgNDYsIFwiY2VudGVyXCIsIFwiY2VudGVyXCIsZmFsc2UpXHJcblxyXG5cclxuXHJcbiAgICAjQG1ldGhvZFxyXG4gICAgI0BwdWJsaWNcclxuICAgICNAZGVzYzogU2V0IHRoZSBldmVudCBmb3IgYWxsIHBvaW50cyBleGNlcHQgdGhlIHN0YXJ0IHBvaW50IGFuZCBab25lXHJcbiAgICAjQHByYW1zOiB7ZnVuY3Rpb259IG9uR2FtZVBvaW50TW92ZUluOlxyXG4gICAgc2V0QWxsUG9pbnRzTW92ZUluOiAob25HYW1lUG9pbnRNb3ZlSW4pPT5cclxuICAgICAgZm9yIHBvaW50IGluIEBnZXRQb2ludHMoKVxyXG4gICAgICAgIHR5cGUgPSBAZ2V0UG9pbnRUeXBlTmFtZShwb2ludC5nZXROYW1lKCkpXHJcbiAgICAgICAgaWYgdHlwZSAhPSBHYW1lZmllbGQucG9pbnRUeXBlcy5TVEFSVCBhbmQgdHlwZSAhPSBHYW1lZmllbGQucG9pbnRUeXBlcy5aT05FXHJcbiAgICAgICAgICBwb2ludC5zZXRNb3ZlaW4ob25HYW1lUG9pbnRNb3ZlSW4pXHJcblxyXG5cclxuICAgICNAbWV0aG9kXHJcbiAgICAjQHJldHVybjogezxhZi5HZW9GZWF0dXJlPkFycmF5fSBQb2ludHMgdGhhdCB0aGUgdXNlciBzZWVcclxuICAgIGdldFZpc2libGVQb2ludHM6ICgpPT4gQHBvaW50c0Rpc3BsYXllZFxyXG5cclxuICAgICNAbWV0aG9kXHJcbiAgICAjQHJldHVybjogezxhZi5HZW9GZWF0dXJlPkFycmF5fSBBbGwgcG9pbnRzXHJcbiAgICBnZXRQb2ludHM6ICgpPT4gQHBvaW50c1xyXG5cclxuXHJcbiAgICAjQG1ldGhvZFxyXG4gICAgI0BwYXJhbToge2FmLkdlb0ZlYXR1cmUuQ29vcmR9IGNvb3JkOiBBIGFmIGNvb3JkIG9iamVjdFxyXG4gICAgI0ByZXR1cm5zIHthZi5HZW9GZWF0dXJlLlBvaW50fSBwb2ludFxyXG4gICAgZ2V0UG9pbnRCeUNvb3JkOiAoY29vcmQpPT5cclxuICAgICAgZm9yIHBvaW50IGluIEBwb2ludHNcclxuICAgICAgICBpZiBAZ2V0UG9pbnRUeXBlTmFtZShwb2ludC5nZXROYW1lKCkpICE9IEdhbWVmaWVsZC5wb2ludFR5cGVzLlpPTkVcclxuICAgICAgICAgIGlmIHBvaW50LmNvbnRhaW5zKGNvb3JkKVxyXG4gICAgICAgICAgICByZXR1cm4gcG9pbnRcclxuXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIldlIGNhbnQgZmluZCBhIHBvaW50IGF0IGNvb3JkOiB4OlwiK2Nvb3JkLngrXCJ5OlwiK2Nvb3JkLnkpXHJcblxyXG4gICAgI0BtZXRob2RcclxuICAgICNAcGFyYW06IHtzdHJpbmd9IG5hbWU6IFRoZSBwdWJsaWMgbmFtZSBvZiB0aGUgcG9pbnRcclxuICAgICNAcmV0dXJucyB7YWYuR2VvRmVhdHVyZX0gcG9pbnRcclxuICAgIGdldFBvaW50QnlOYW1lOiAobmFtZSk9PlxyXG4gICAgICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpXHJcbiAgICAgIGZvciBwb2ludCBpbiBAcG9pbnRzXHJcbiAgICAgICAgcG9pbnROYW1lID0gcG9pbnQuZ2V0TmFtZSgpXHJcbiAgICAgICAgcG9pbnROYW1lID0gcG9pbnROYW1lLnN1YnN0cmluZyhAbmFtZS5sZW5ndGgrMSkudG9Mb3dlckNhc2UoKSNSZW1vdmUgbWFwbmFtZVxyXG4gICAgICAgIHBvaW50TmFtZSA9IHBvaW50TmFtZS5yZXBsYWNlKFwialwiLFwiXCIpI1JlbW92ZSBqb2tlciBtYXJrZXJcclxuICAgICAgICBpZiBwb2ludE5hbWUgPT0gbmFtZVxyXG4gICAgICAgICAgcmV0dXJuIHBvaW50XHJcblxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXZSBjYW50IGZpbmQgdGhlIHBvaW50IHdpdGggdGhlIG5hbWU6IFwiK25hbWUgKVxyXG5cclxuICAgICNAbWV0aG9kXHJcbiAgICAjQHJldHVybnMgezxhZi5HZW9GZWF0dXJlPkFycmF5fSBBcnJheSBvZiB0aGUgbmV4dCAyIHBvaW50c1xyXG4gICAgI0BkZXNjOiBJbmNyZW1lbnQgdGhlIHJvdW5kIGFuZCByZXR1cm5zIHRoZSBuZXh0IDIgcG9pbnRzXHJcbiAgICBnZXROZXh0UG9pbnRzOiAoKT0+XHJcbiAgICAgIGFyciA9IFtAZ2V0UG9pbnRCeU5hbWUoXCJQXCIrQHJvdW5kK1wiLjFcIiksQGdldFBvaW50QnlOYW1lKFwiUFwiK0Byb3VuZCtcIi4yXCIpXVxyXG4gICAgICBAcm91bmQgKz0xXHJcbiAgICAgIHJldHVybiBhcnJcclxuXHJcbiAgICAjQG1ldGhvZFxyXG4gICAgI0ByZXR1cm5zIHZvaWRcclxuICAgICNAZGVzYzogRGlzcGxheSB0aGUgbmV4dCByb3VuZFxyXG4gICAgZGlzcGxheU5leHRSb3VuZDogKCk9PlxyXG4gICAgICBuZXh0ID0gQGdldE5leHRQb2ludHMoKVxyXG4gICAgICBAaGlkZVBvaW50cyhAZ2V0VmlzaWJsZVBvaW50cygpKVxyXG4gICAgICBAZGlzcGxheVBvaW50cyhuZXh0KVxyXG5cclxuXHJcbiAgICBnZXRTdGFydFBvaW50OiAoKT0+IEBnZXRQb2ludEJ5TmFtZShcIlN0YXJ0XCIpXHJcblxyXG4gICAgI0BkZXM6IERpc3BsYXkgYSBzaW5nbGUgcG9pbnQgb24gdGhlIG1hcFxyXG4gICAgZGlzcGxheVBvaW50OiAocG9pbnQpPT4gQGRpc3BsYXlQb2ludHMoW3BvaW50XSlcclxuICAgICNAZGVzOiBEaXNwbGF5IGEgYXJyYXkgb2YgcG9pbnRzIG9uIHRoZSBtYXBcclxuICAgICNAcGFyYW06IHthcnJheX0gcG9pbnRzOiBwb2ludCBhcnJheVxyXG4gICAgZGlzcGxheVBvaW50czogKHBvaW50cyk9PlxyXG4gICAgICBmb3IgcG9pbnQgaW4gcG9pbnRzXHJcbiAgICAgICAgcG9pbnQuc2V0TWFya2VyVmlzaWJsZSh0cnVlKTtcclxuICAgICAgICBAcG9pbnRzRGlzcGxheWVkLnB1c2gocG9pbnQpXHJcblxyXG4gICAgI0BkZXM6IEhpZGUgYSBzaW5nbGUgcG9pbnQgb24gdGhlIG1hcFxyXG4gICAgaGlkZVBvaW50OiAocG9pbnQpPT4gQGhpZGVQb2ludHMoW3BvaW50XSlcclxuICAgICNAZGVzOiBIaWRlIGEgYXJyYXkgb2YgcG9pbnRzIG9uIHRoZSBtYXBcclxuICAgICNAcGFyYW06IHthcnJheX0gcG9pbnRzOiBwb2ludCBhcnJheVxyXG4gICAgaGlkZVBvaW50czogKHBvaW50cyk9PlxyXG4gICAgICBmb3IgcG9pbnQgaW4gcG9pbnRzXHJcbiAgICAgICAgcG9pbnQuc2V0TWFya2VyVmlzaWJsZShmYWxzZSk7XHJcbiAgICAgICAgQHBvaW50c0Rpc3BsYXllZCA9IEBwb2ludHNEaXNwbGF5ZWQuc2xpY2UoQHBvaW50c0Rpc3BsYXllZC5pbmRleE9mKHBvaW50KSwxKVxyXG5cclxuICAgIHVzZXJJbnNpZGVab25lOiAoKT0+IEB6b25lLnVzZXJJbnNpZGUoKVxyXG4gICAgc2V0Wm9uZU1vdmVJbjogKGhhbmRsZXIpPT4gQHpvbmUuc2V0TW92ZWluKGhhbmRsZXIpICNBZGQgYmluZGluZyBoYW5kbGVyIGZvciBtb3ZlIGluXHJcbiAgICBzZXRab25lTW92ZU91dDogKGhhbmRsZXIpPT5Aem9uZS5zZXRNb3Zlb3V0KGhhbmRsZXIpICNBZGQgYmluZGluZyBoYW5kbGVyIGZvciBtb3ZlIGluXHJcblxyXG4gICAgc2V0U3RhcnRQb2ludE1vdmVJbjogKGhhbmRsZXIpPT4gQHN0YXJ0UG9pbnQuc2V0TW92ZWluKGhhbmRsZXIpICNBZGQgYmluZGluZyBoYW5kbGVyIGZvciBtb3ZlIGluXHJcbiAgICBzZXRTdGFydFBvaW50TW92ZU91dDogKGhhbmRsZXIpPT4gQHN0YXJ0UG9pbnQuc2V0TW92ZW91dChoYW5kbGVyKSAjQWRkIGJpbmRpbmcgaGFuZGxlciBmb3IgbW92ZSBpblxyXG4gICAgZ2V0VGltZXJOb2RlOiAoKT0+VXRpbHNBcHBmdXJuYWNlLmdldFVJRWxlbWVudEJ5TmFtZShcInVpLmxhYmVsLnRpbWVyXCIsVXRpbHNBcHBmdXJuYWNlLmdldFBhZ2UoQG5hbWUpKS5maW5kKFwiLnZjZW50ZXJhYmxlXCIpLmZpcnN0KClcclxuICAgIGdldENvaW5Ob2RlOiAoKT0+IFV0aWxzQXBwZnVybmFjZS5nZXRVSUVsZW1lbnRCeU5hbWUoXCJ1aS5sYWJlbC5jb2luc1wiLFV0aWxzQXBwZnVybmFjZS5nZXRQYWdlKEBuYW1lKSkuZmluZChcIi52Y2VudGVyYWJsZVwiKS5maXJzdCgpXHJcbiAgICBnZXRKb2tlck5vZGU6ICgpPT4gVXRpbHNBcHBmdXJuYWNlLmdldFVJRWxlbWVudEJ5TmFtZShcInVpLmJ0bi5jdXJyZW50Sm9rZXJcIixVdGlsc0FwcGZ1cm5hY2UuZ2V0UGFnZShAbmFtZSkpLmZpbmQoXCIubGFiZWxcIikuZmlyc3QoKVxyXG5cclxuXHJcbiAgICBnZXREZWZhdWx0VGltZTogKCk9PiAxODAwMDAgIy0+IGluIG1zIDw9PiAzIG1pbi4iXX0=
