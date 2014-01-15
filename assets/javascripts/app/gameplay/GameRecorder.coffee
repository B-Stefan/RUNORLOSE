define ['require','baseClasses/RealTimeCommunicationChannel'],
(require,RealTimeCommunicationChannel) ->
  #@class
  #@desc Recorder game actions
  class GameRecorder
    @recordTypes:
      POINT_COIN: 'POINT_COIN'
      POINT_JOKER: 'POINT_JOKER'
      APPLY_JOKER: 'APPLY_JOKER'
      POSITION: 'POSITION'

    #@constructor
    #@param: {Game} gameInstance The game instnace to record
    constructor: (gameInstance)->
      @game = gameInstance
      @channel = new RealTimeCommunicationChannel('presence-recorder')

    #@method
    #@private
    #@desc push the data to the channel
    #@param {string} eventName
    #@param {object} [data=new Object]: The object data
    trigger: (eventName, data = {})=> @channel.channel.trigger('client-'+eventName, data)
    startGameRecorder: ()=>
      @trigger("start", {data: 'gameStarted'})
      self = @
      Game = require('gameplay/Game')
      interV = setInterval(()->
        if self.game.getState() == Game.gameStates.FINISHED
          clearInterval(interV)
        self.recordPosition()
      ,10000)# Record position every 10 seconds
    recordPosition: ()=>@recordGameEvent(GameRecorder.recordTypes.POSITION, af.locationSensor.getLastLocation())
    #@method
    recordGameEvent: (type, value)=>
      @trigger("record",
        type: type
        value: value
        LocalRemainingTime: @game.getRemainingTime()
        gameId:@game.getId()
      )