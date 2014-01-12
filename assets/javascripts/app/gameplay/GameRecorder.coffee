define [ 'baseClasses/RealTimeCommunicationChannel'],
(RealTimeCommunicationChannel) ->
  #@class
  #@desc Recorder game actions
  class GameRecorder
    @recordTypes:
      POINT_COIN: 'POINT_COIN'
      POINT_JOKER: 'POINT_JOKER'
      APPLY_JOKER: 'APPLY_JOKER'

    #@constructor
    #@param: {Game} gameInstance The game instnace to record
    constructor: (gameInstance)->
      @game = gameInstance
      @channel = new RealTimeCommunicationChannel('presence-recorder')

    startGameRecorder: ()=>
      @channel.channel.trigger("client-start", {data: 'gameStarted'})
    #@method
    recordGameEvent: (type, value)=>
      @channel.channel.trigger("client-record",
        type: type
        value: value
        LocalRemainingTime: @game.getRemainingTime()
        gameId:@game.getId()
      )