define ['require', 'pusher','jquery'],
(require, Pusher, $)->

  class RealTimeCommunicationChannel

    #@static
    @pusher = new Pusher('2f094784183748ae23e1',{ authEndpoint: 'https://rol-hs-bremen.appspot.com/pusher/presence_auth'})

    #@constructor
    constructor:(@channelName)->
      self = @
      if @channelName == undefined != channelName =""
        throw  new Error("Undefined channel name!")
      else if @channelName.indexOf('presence') == -1
        throw  new Error("This class only allow presence channels")


      @channel =  RealTimeCommunicationChannel.pusher.subscribe(@channelName) #User presence to create a room

      #Create promise because the subscribtion is async
      #@public
      #@type {$.promise}
      @channelSubscription = $.Deferred (dfr)->
        self.channel.bind('pusher:subscription_succeeded',dfr.resolve)
        self.channel.bind('pusher:subscription_error',dfr.reject)

      #@public
      #@method
    unsubscribe:() =>
        RealTimeCommunicationChannel.pusher.unsubscribe(@channelName);

