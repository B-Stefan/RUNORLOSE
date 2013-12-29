var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['jquery', 'baseClasses/UtilsAppfurnace'], function($, UtilsAppfurnace) {
  var Joker;
  return Joker = (function() {
    Joker.jokerTypes = {
      STEAL_COINS: 'STEAL_COINS',
      STEAL_TIME: 'STEAL_TIME'
    };

    Joker.jokerImages = {
      STEAL_COINS: 'content/images/MuenzWechsel.png',
      STEAL_TIME: 'content/images/MINUSZeit.png'
    };

    Joker.getImageNode = function(jokerType, options) {
      var $imgNode, url;
      if (options == null) {
        options = {
          width: 21,
          height: 21
        };
      }
      url = Joker.jokerImages[jokerType];
      if (url === void 0) {
        throw new Error("We cant an image path to Joker.jokerTypes: " + jokerType);
      }
      $imgNode = $("<img \>");
      $imgNode.attr('src', url);
      $imgNode.attr('width', options.width);
      $imgNode.attr('height', options.height);
      $imgNode.css("vertical-align", 'middle');
      return $imgNode;
    };

    Joker.animateImgageNode = function($node, jokerType) {
      var dfr;
      dfr = $.Deferred();
      return $node.animate({
        "opacity": "0"
      }, 400).promise().done(function() {
        $node.html(Joker.getImageNode(jokerType));
        return $node.animate({
          "opacity": "1"
        }, 400).promise().done(function(event) {
          return dfr.resolve();
        });
      });
    };

    Joker.getRandomJoker = function() {
      var i, key, length, randomIndex, value, _ref;
      length = 0;
      for (key in Joker.jokerTypes) {
        length += 1;
      }
      randomIndex = Math.floor(Math.random() * length);
      i = 0;
      _ref = Joker.jokerTypes;
      for (key in _ref) {
        value = _ref[key];
        if (i === randomIndex) {
          return new Joker(value);
        } else {
          i += 1;
        }
      }
    };

    function Joker(jokerType) {
      this.getImageNode = __bind(this.getImageNode, this);
      this.getDescription = __bind(this.getDescription, this);
      this.getType = __bind(this.getType, this);
      this.applyEffekt = __bind(this.applyEffekt, this);
      this.type = jokerType;
    }

    Joker.prototype.applyEffekt = function() {
      throw new Error("Not implemented yet :( ");
    };

    Joker.prototype.getType = function() {
      return this.type;
    };

    Joker.prototype.getDescription = function() {
      return UtilsAppfurnace.getPage("Popup.Joker." + this.getType() + ".info");
    };

    Joker.prototype.getImageNode = function() {
      return Joker.getImageNode(this.getType());
    };

    return Joker;

  })();
});

//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzpcXFVzZXJzXFxTdGVmYW5cXFNreURyaXZlXFxFbnR3aWNrbHVuZ1xcV2Vic3Rvcm1Qcm9qZWN0c1xcUk9MIC0gUlVOIE9SIExPU0VcXHB1YmxpY1xcamF2YXNjcmlwdHNcXGFwcFxcZ2FtZXBsYXlcXEpva2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxTdGVmYW5cXFNreURyaXZlXFxFbnR3aWNrbHVuZ1xcV2Vic3Rvcm1Qcm9qZWN0c1xcUk9MIC0gUlVOIE9SIExPU0VcXGFzc2V0c1xcamF2YXNjcmlwdHNcXGFwcFxcZ2FtZXBsYXlcXEpva2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLDhFQUFBOztBQUFBLENBQUEsQ0FDUSxDQUNSLEdBRkEsRUFBTyxDQUVOLE1BQUQsY0FGTztDQUdMLElBQUEsQ0FBQTtTQUFNO0NBR0osRUFDRSxDQURGLENBQUMsS0FBRDtDQUNFLENBQWEsSUFBYixLQUFBLEVBQUE7Q0FBQSxDQUNZLElBQVosSUFBQSxFQURBO0NBREYsS0FBQTs7Q0FBQSxFQVFFLENBREYsQ0FBQyxNQUFEO0NBQ0UsQ0FBYSxJQUFiLEtBQUEsc0JBQUE7Q0FBQSxDQUNZLElBQVosSUFBQSxvQkFEQTtDQVJGLEtBQUE7O0NBQUEsQ0FhMEIsQ0FBWixDQUFkLENBQUMsRUFBYSxFQUFDLEdBQWY7Q0FDRSxTQUFBLEdBQUE7O0dBRGtDLEtBQVY7Q0FBVSxDQUFRLEdBQVAsS0FBQTtDQUFELENBQWtCLElBQVAsSUFBQTs7UUFDN0M7Q0FBQSxFQUFBLEVBQVcsQ0FBWCxHQUF3QixFQUFBO0NBQ3hCLEVBQUcsQ0FBQSxDQUFPLENBQVY7Q0FDRSxFQUE4RCxDQUFwRCxDQUFBLElBQUEsS0FBQSwrQkFBTTtRQUZsQjtDQUFBLEVBSVcsR0FBWCxFQUFBLENBQVc7Q0FKWCxDQUtvQixDQUFwQixDQUFBLENBQUEsQ0FBQSxFQUFRO0NBTFIsQ0FNc0IsRUFBdEIsQ0FBQSxDQUFBLENBQUEsQ0FBUTtDQU5SLENBT3VCLEVBQXZCLEVBQUEsQ0FBOEIsQ0FBdEI7Q0FQUixDQVE4QixDQUE5QixHQUFBLEVBQVEsUUFBUjtDQUNBLE9BQUEsS0FBTztDQXZCVCxJQWFjOztDQWJkLENBK0IyQixDQUFSLENBQW5CLENBQUMsSUFBbUIsUUFBcEI7Q0FDRSxFQUFBLE9BQUE7Q0FBQSxFQUFBLEdBQUEsRUFBTTtDQUNBLElBQUQsRUFBTCxNQUFBO0NBQWMsQ0FBWSxDQUFaLEtBQUMsQ0FBQTtDQUFxQixDQUFKLENBQWhDLENBQUEsR0FBQSxDQUFBLENBQW9EO0NBQ2xELEdBQUEsQ0FBSyxHQUFMLENBQVcsR0FBQTtDQUNMLElBQUQsRUFBTCxRQUFBO0NBQWMsQ0FBWSxDQUFaLE1BQUMsQ0FBQTtDQUFxQixDQUFKLENBQWhDLENBQUEsQ0FBb0QsRUFBcEQsRUFBcUQsQ0FBckQ7Q0FDTSxFQUFELElBQUgsVUFBQTtDQURGLFFBQW9EO0NBRnRELE1BQW9EO0NBakN0RCxJQStCbUI7O0NBL0JuQixFQXlDaUIsQ0FBakIsQ0FBQyxJQUFnQixLQUFqQjtDQUNFLFNBQUEsOEJBQUE7Q0FBQSxFQUFTLEdBQVQ7QUFDQSxDQUFBLEVBQUEsUUFBQSxZQUFBO0NBQ0UsR0FBUyxFQUFULEVBQUE7Q0FERixNQURBO0NBQUEsRUFJYyxDQUFJLENBQUosQ0FBZCxLQUFBO0NBSkEsRUFLSSxHQUFKO0NBQ0E7Q0FBQSxVQUFBOzJCQUFBO0NBQ0UsR0FBRyxDQUFLLEdBQVIsR0FBQTtDQUNFLEdBQVcsQ0FBQSxZQUFBO01BRGIsSUFBQTtDQUdFLEdBQUksTUFBSjtVQUpKO0NBQUEsTUFQZTtDQXpDakIsSUF5Q2lCOztDQWdCSixFQUFBLENBQUEsS0FBQSxNQUFDO0NBSVosa0RBQUE7Q0FBQSxzREFBQTtDQUFBLHdDQUFBO0NBQUEsZ0RBQUE7Q0FBQSxFQUFRLENBQVAsRUFBRCxHQUFBO0NBN0RGLElBeURhOztDQXpEYixFQWlFYSxNQUFBLEVBQWI7Q0FBa0IsR0FBVSxDQUFBLE9BQUEsYUFBQTtDQWpFNUIsSUFpRWE7O0NBakViLEVBcUVTLElBQVQsRUFBUztDQUFNLEdBQUEsU0FBRDtDQXJFZCxJQXFFUzs7Q0FyRVQsRUF5RWdCLE1BQUEsS0FBaEI7Q0FDa0IsRUFBdUIsQ0FBQyxHQUF4QyxNQUFBLENBQXdCLENBQVQ7Q0ExRWpCLElBeUVnQjs7Q0F6RWhCLEVBNkVjLE1BQUEsR0FBZDtDQUF5QixHQUFjLENBQWYsRUFBYyxLQUFuQixDQUFBO0NBN0VuQixJQTZFYzs7Q0E3RWQ7O0NBSko7Q0FBQSIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSBbJ2pxdWVyeScsXHJcbiAgICAgICAgJ2Jhc2VDbGFzc2VzL1V0aWxzQXBwZnVybmFjZSddLFxyXG4oJCxVdGlsc0FwcGZ1cm5hY2UpLT5cclxuICBjbGFzcyBKb2tlclxyXG4gICAgI0BzdGF0aWNcclxuICAgICNAdHlwZTogZW51bVxyXG4gICAgQGpva2VyVHlwZXM6XHJcbiAgICAgIFNURUFMX0NPSU5TOiAnU1RFQUxfQ09JTlMnXHJcbiAgICAgIFNURUFMX1RJTUU6ICdTVEVBTF9USU1FJ1xyXG5cclxuICAgICNAc3RhdGljXHJcbiAgICAjQHR5cGU6IGVudW1cclxuICAgICNAZGVzYzogVGhlIHBhdGggdG8gdGhlIGpva2VyIGltYWdlc1xyXG4gICAgQGpva2VySW1hZ2VzOlxyXG4gICAgICBTVEVBTF9DT0lOUzogJ2NvbnRlbnQvaW1hZ2VzL011ZW56V2VjaHNlbC5wbmcnXHJcbiAgICAgIFNURUFMX1RJTUU6ICdjb250ZW50L2ltYWdlcy9NSU5VU1plaXQucG5nJ1xyXG5cclxuICAgICNAbWV0aG9kXHJcbiAgICAjQHBhcmFtOiB7Sm9rZXIuam9rZXJUeXBlfSBqb2tlclR5cGVcclxuICAgIEBnZXRJbWFnZU5vZGU6KGpva2VyVHlwZSwgb3B0aW9ucyA9IHt3aWR0aDogMjEsaGVpZ2h0OjIxfSktPlxyXG4gICAgICB1cmwgPSBKb2tlci5qb2tlckltYWdlc1tqb2tlclR5cGVdXHJcbiAgICAgIGlmIHVybCA9PSB1bmRlZmluZWRcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXZSBjYW50IGFuIGltYWdlIHBhdGggdG8gSm9rZXIuam9rZXJUeXBlczogXCIram9rZXJUeXBlKVxyXG5cclxuICAgICAgJGltZ05vZGUgPSAkKFwiPGltZyBcXD5cIilcclxuICAgICAgJGltZ05vZGUuYXR0cignc3JjJyx1cmwpXHJcbiAgICAgICRpbWdOb2RlLmF0dHIoJ3dpZHRoJyxvcHRpb25zLndpZHRoKVxyXG4gICAgICAkaW1nTm9kZS5hdHRyKCdoZWlnaHQnLG9wdGlvbnMuaGVpZ2h0KVxyXG4gICAgICAkaW1nTm9kZS5jc3MoXCJ2ZXJ0aWNhbC1hbGlnblwiLCdtaWRkbGUnKVxyXG4gICAgICByZXR1cm4gJGltZ05vZGVcclxuXHJcbiAgICAjQG1ldGhvZFxyXG4gICAgI0BzdGF0aWNcclxuICAgICNAZGVzYzogQW5uaW1hdGUgdGhlIHBhcmFtICRpbWFnZU5vZGVcclxuICAgICNAcGFyYW06IHtqUXVlcnkuRWxlbWVudH0gJE5vZGU6IFRoZSBqcXVlcnkgaHRtbCBub2RlXHJcbiAgICAjQHBhcmFtOiB7Sm9rZXIuam9rZXJUeXBlfSBqb2tlclR5cGU6IFRoZSBUeXBlIHRvIGJlIHNob3dcclxuICAgICNAcmV0dXJuOiBqUXVlcnkuUHJvbWlzZVxyXG4gICAgQGFuaW1hdGVJbWdhZ2VOb2RlOigkbm9kZSwgam9rZXJUeXBlKS0+XHJcbiAgICAgIGRmciA9ICQuRGVmZXJyZWQoKVxyXG4gICAgICAkbm9kZS5hbmltYXRlKHtcIm9wYWNpdHlcIjogXCIwXCJ9LCA0MDApLnByb21pc2UoKS5kb25lICgpLT5cclxuICAgICAgICAkbm9kZS5odG1sKEpva2VyLmdldEltYWdlTm9kZShqb2tlclR5cGUpKVxyXG4gICAgICAgICRub2RlLmFuaW1hdGUoe1wib3BhY2l0eVwiOiBcIjFcIn0sIDQwMCkucHJvbWlzZSgpLmRvbmUgKGV2ZW50KS0+XHJcbiAgICAgICAgICBkZnIucmVzb2x2ZSgpXHJcblxyXG4gICAgI0BtZXRob2RcclxuICAgICNAc3RhdGljXHJcbiAgICAjQGRlc2M6IFJldHVybiBhbiBuZXcgcmFuZG9tIEpva2VyIGluc3RhbmNlIChyYW5kb20gdHlwZSlcclxuICAgIEBnZXRSYW5kb21Kb2tlcjogKCktPlxyXG4gICAgICBsZW5ndGggPSAwXHJcbiAgICAgIGZvciBrZXkgb2YgSm9rZXIuam9rZXJUeXBlc1xyXG4gICAgICAgIGxlbmd0aCArPTFcclxuXHJcbiAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbGVuZ3RoKVxyXG4gICAgICBpID0gMFxyXG4gICAgICBmb3Iga2V5LHZhbHVlIG9mIEpva2VyLmpva2VyVHlwZXNcclxuICAgICAgICBpZiBpID09IHJhbmRvbUluZGV4XHJcbiAgICAgICAgICByZXR1cm4gbmV3IEpva2VyKHZhbHVlKVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGkgKz0xXHJcblxyXG5cclxuICAgICNAY29uc3RydWN0b3JcclxuICAgICNAcGFyYW06IHtKb2tlci5qb2tlclR5cGVzfSBqb2tlclR5cGU6IFRoZSB0eXBlIG9mIHRoZSBuZXcgam9rZXJcclxuICAgIGNvbnN0cnVjdG9yOiAoam9rZXJUeXBlKS0+XHJcblxyXG4gICAgICAjQHByaXZhdGVcclxuICAgICAgI0B0eXBlOiBKb2tlci5qb2tlclR5cGVcclxuICAgICAgQHR5cGUgPSBqb2tlclR5cGVcclxuXHJcbiAgICAjQG1ldGhvZFxyXG4gICAgI0BwdWJsaWNcclxuICAgIGFwcGx5RWZmZWt0OiAoKT0+IHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXQgOiggXCIpXHJcbiAgICAjQG1ldGhvZFxyXG4gICAgI0BwdWJsaWNcclxuICAgICNAcmV0dW4ge0pva2VyLmpva2VyVHlwZX0gdHlwZVxyXG4gICAgZ2V0VHlwZTogKCk9PiBAdHlwZVxyXG5cclxuICAgICNAbWV0aG9kXHJcbiAgICAjQHJldHVybnM6IHtKUXVlcnkuRWxlbWVudH0gVGhlIGRlc2NyaXB0aW9uIHBhZ2VcclxuICAgIGdldERlc2NyaXB0aW9uOiAoKT0+XHJcbiAgICAgIFV0aWxzQXBwZnVybmFjZS5nZXRQYWdlKFwiUG9wdXAuSm9rZXIuXCIrQGdldFR5cGUoKStcIi5pbmZvXCIpXHJcbiAgICAjQG1ldGhvZFxyXG4gICAgI0ByZXR1cm4ge2pRdXJ5LkVsZW1lbnR9IGltYWdlIG5vZGVcclxuICAgIGdldEltYWdlTm9kZTogKCk9PiBKb2tlci5nZXRJbWFnZU5vZGUoQGdldFR5cGUoKSlcclxuIl19
