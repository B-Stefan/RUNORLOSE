var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['require', 'pusher', 'jquery'], function(require, Pusher, $) {
  var RealTimeCommunicationChannel;
  return RealTimeCommunicationChannel = (function() {
    RealTimeCommunicationChannel.pusher = new Pusher('2f094784183748ae23e1', {
      authEndpoint: 'https://rol-hs-bremen.appspot.com/pusher/presence_auth'
    });

    function RealTimeCommunicationChannel(channelName) {
      var self;
      this.channelName = channelName;
      this.unsubscribe = __bind(this.unsubscribe, this);
      self = this;
      if ((this.channelName === void 0 && void 0 !== (channelName = ""))) {
        throw new Error("Undefined channel name!");
      } else if (this.channelName.indexOf('presence') === -1) {
        throw new Error("This class only allow presence channels");
      }
      this.channel = RealTimeCommunicationChannel.pusher.subscribe(this.channelName);
      this.channelSubscription = $.Deferred(function(dfr) {
        self.channel.bind('pusher:subscription_succeeded', dfr.resolve);
        return self.channel.bind('pusher:subscription_error', dfr.reject);
      });
    }

    RealTimeCommunicationChannel.prototype.unsubscribe = function() {
      return RealTimeCommunicationChannel.pusher.unsubscribe(this.channelName);
    };

    return RealTimeCommunicationChannel;

  })();
});

//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzpcXFVzZXJzXFxTdGVmYW5cXFNreURyaXZlXFxFbnR3aWNrbHVuZ1xcV2Vic3Rvcm1Qcm9qZWN0c1xcUk9MIC0gUlVOIE9SIExPU0VcXHB1YmxpY1xcamF2YXNjcmlwdHNcXGFwcFxcYmFzZUNsYXNzZXNcXFJlYWxUaW1lQ29tbXVuaWNhdGlvbkNoYW5uZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXFN0ZWZhblxcU2t5RHJpdmVcXEVudHdpY2tsdW5nXFxXZWJzdG9ybVByb2plY3RzXFxST0wgLSBSVU4gT1IgTE9TRVxcYXNzZXRzXFxqYXZhc2NyaXB0c1xcYXBwXFxiYXNlQ2xhc3Nlc1xcUmVhbFRpbWVDb21tdW5pY2F0aW9uQ2hhbm5lbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSw4RUFBQTs7QUFBQSxDQUFBLENBQW1CLENBQ25CLEdBREEsQ0FDQSxDQURPLENBQUE7Q0FHTCxLQUFBLHNCQUFBO1NBQU07Q0FHSixDQUE0QyxDQUE5QixDQUFkLEVBQUEsZ0JBQWMsTUFBYjtDQUEyQyxDQUFnQixJQUFkLE1BQUEsNENBQUY7Q0FBNUMsS0FBYzs7Q0FHRixFQUFBLENBQUEsT0FBQSwyQkFBRTtDQUNaLEdBQUEsTUFBQTtDQUFBLEVBRFksQ0FBQSxFQUFELEtBQ1g7Q0FBQSxnREFBQTtDQUFBLEVBQU8sQ0FBUCxFQUFBO0NBQ0EsQ0FBZ0MsQ0FBYSxDQUExQyxDQUFnQixDQUFuQixLQUFHO0NBQ0QsR0FBVyxDQUFBLFNBQUEsV0FBQTtBQUNnQyxDQUFwQyxHQUFELENBQW9DLENBRjVDLENBRVEsQ0FGUixFQUVRLENBQVk7Q0FDbEIsR0FBVyxDQUFBLFNBQUEsMkJBQUE7UUFKYjtDQUFBLEVBT1ksQ0FBWCxFQUFELENBQUEsRUFBWSxFQUFBLGlCQUE0QjtDQVB4QyxFQVl1QixDQUF0QixFQUFELEVBQXVCLENBQVksVUFBbkM7Q0FDRSxDQUFrRCxDQUFHLENBQWpELEdBQVEsQ0FBWix1QkFBQTtDQUNLLENBQXlDLENBQUcsQ0FBN0MsRUFBSixDQUFZLFFBQVosWUFBQTtDQUZxQixNQUFXO0NBaEJwQyxJQUdZOztDQUhaLEVBc0JZLE1BQUEsRUFBWjtDQUNpQyxHQUFvQixFQUFkLEtBQW5DLEVBQUEsZUFBNEI7Q0F2QmhDLElBc0JZOztDQXRCWjs7Q0FMSjtDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lIFsncmVxdWlyZScsICdwdXNoZXInLCdqcXVlcnknXSxcclxuKHJlcXVpcmUsIFB1c2hlciwgJCktPlxyXG5cclxuICBjbGFzcyBSZWFsVGltZUNvbW11bmljYXRpb25DaGFubmVsXHJcblxyXG4gICAgI0BzdGF0aWNcclxuICAgIEBwdXNoZXIgPSBuZXcgUHVzaGVyKCcyZjA5NDc4NDE4Mzc0OGFlMjNlMScseyBhdXRoRW5kcG9pbnQ6ICdodHRwczovL3JvbC1ocy1icmVtZW4uYXBwc3BvdC5jb20vcHVzaGVyL3ByZXNlbmNlX2F1dGgnfSlcclxuXHJcbiAgICAjQGNvbnN0cnVjdG9yXHJcbiAgICBjb25zdHJ1Y3RvcjooQGNoYW5uZWxOYW1lKS0+XHJcbiAgICAgIHNlbGYgPSBAXHJcbiAgICAgIGlmIEBjaGFubmVsTmFtZSA9PSB1bmRlZmluZWQgIT0gY2hhbm5lbE5hbWUgPVwiXCJcclxuICAgICAgICB0aHJvdyAgbmV3IEVycm9yKFwiVW5kZWZpbmVkIGNoYW5uZWwgbmFtZSFcIilcclxuICAgICAgZWxzZSBpZiBAY2hhbm5lbE5hbWUuaW5kZXhPZigncHJlc2VuY2UnKSA9PSAtMVxyXG4gICAgICAgIHRocm93ICBuZXcgRXJyb3IoXCJUaGlzIGNsYXNzIG9ubHkgYWxsb3cgcHJlc2VuY2UgY2hhbm5lbHNcIilcclxuXHJcblxyXG4gICAgICBAY2hhbm5lbCA9ICBSZWFsVGltZUNvbW11bmljYXRpb25DaGFubmVsLnB1c2hlci5zdWJzY3JpYmUoQGNoYW5uZWxOYW1lKSAjVXNlciBwcmVzZW5jZSB0byBjcmVhdGUgYSByb29tXHJcblxyXG4gICAgICAjQ3JlYXRlIHByb21pc2UgYmVjYXVzZSB0aGUgc3Vic2NyaWJ0aW9uIGlzIGFzeW5jXHJcbiAgICAgICNAcHVibGljXHJcbiAgICAgICNAdHlwZSB7JC5wcm9taXNlfVxyXG4gICAgICBAY2hhbm5lbFN1YnNjcmlwdGlvbiA9ICQuRGVmZXJyZWQgKGRmciktPlxyXG4gICAgICAgIHNlbGYuY2hhbm5lbC5iaW5kKCdwdXNoZXI6c3Vic2NyaXB0aW9uX3N1Y2NlZWRlZCcsZGZyLnJlc29sdmUpXHJcbiAgICAgICAgc2VsZi5jaGFubmVsLmJpbmQoJ3B1c2hlcjpzdWJzY3JpcHRpb25fZXJyb3InLGRmci5yZWplY3QpXHJcblxyXG4gICAgICAjQHB1YmxpY1xyXG4gICAgICAjQG1ldGhvZFxyXG4gICAgdW5zdWJzY3JpYmU6KCkgPT5cclxuICAgICAgICBSZWFsVGltZUNvbW11bmljYXRpb25DaGFubmVsLnB1c2hlci51bnN1YnNjcmliZShAY2hhbm5lbE5hbWUpO1xyXG5cclxuIl19
