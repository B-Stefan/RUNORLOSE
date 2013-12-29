define ['require',
        'baseClasses/RealTimeCommunicationChannel'
        'jquery-popup',
        'jquery',
        'gameplay/Gamefield',
        'baseClasses/UtilsAppfurnace',
        'moment',
        'gameplay/Joker'],

(require,RealTimeCommunicationChannel, unused, $,Gamefield,UtilsAppfurnace,moment,Joker)->
  #@class
  #@desc The main game class
  class Game
    #@static
    #@typ enum
    @gameStates = {
      INSIDE_ZONE: 10 #Wating for player to enter zone
      ON_STARTPOINT: 20 #Waiting reach the point
      OUTSIDE_ZONE: 30 #Player move out the playground / zone

      STARTED: 40
      WAITING_FOR_PLAYER: 50 #Network connection error
      TIMER_END: 55
      FINISHED:60
    }
    #@static
    #@desc current Game
    @currentGame = null

    #@static
    #@desc caled by clicking on a map
    @onMapClick: ()->
      if Game.currentGame != null
      #Destroy / Cancle game
      #@todo Aks user to cancle the other game
        Game.currentGame.destroy()

      Game.currentGame = new Game(this.name())
      #Do something with the player
      console.log(['onMapShow',arguments, this.uid()])

    #@constructor
    constructor: (mapId)->
      self = @
      @setState(Game.gameStates.OUTSIDE_ZONE)


      #@private
      #@type popup for game
      @$popup = $("<div class='popup'></div>")
      $("body").append(@$popup)
      @$popup.popup(width: $(window).width() * 0.8, height: 150)

      #@private
      #@type decimal
      @coins = 0.0

      #@private
      #@type: Joker
      #@default: null
      @currentJoker = null

      #@private
      #@type int
      @playerCount = 0
      @name = mapId.replace(" ","");

      @gamefield = new Gamefield(@name)
      @gamefield.setZoneMoveIn(@onZoneMoveIn)
      @gamefield.setStartPointMoveIn(@onStartPointMoveIn)

      @gamefield.setZoneMoveOut(@onZoneMoveOut)
      @gamefield.setStartPointMoveOut(@onStartPointMoveOut)
      @gamefield.setAllPointsMoveIn(@onGamePointMoveIn)


      @gamefield.displayPoint(@gamefield.getStartPoint());
      #@private
      #@type time in ms
      @remainingTime = @gamefield.getDefaultTime()


      #Add Binings
      @channel = new RealTimeCommunicationChannel('presence-'+@map)
      @channel.channelSubscription.done ()->
        self.channel.channel.bind("pusher:member_added", self.onPlayerJoin)
        self.channel.channel.bind("pusher:member_removed", self.onPlayerLeft)
        self.channel.channel.bind("client-startGame", self.onGameStart)
        self.channel.channel.bind("client-gameFinisched", self.onGameFinisched)

      #Add UI-Bindings
      @gamefield.getJokerNode().click(@onCurrentJokerClick)


    #@method
    #@private
    #@desc: Start the internal timer and update every interval the display
    startTimer: ()=>
      startTime = moment()
      self = @
      timer   = window.setInterval(()->
        self.remainingTime = self.remainingTime -  1000
        if self.remainingTime <= 0
          clearInterval(timer)
          self.remainingTime = 0
          self.onTimerEnd()
        self.gamefield.getTimerNode().html("Zeit: "+moment(self.remainingTime).format("mm:ss"))

      ,1000)

    #@method
    #@priate
    #@parms {jQuery.Elememt | string} $el
    #@retuns {jQuery.Promise}
    showPopupContent: ($el) =>
      #Cover the old views
      if @$popup.children().length > 0
        UtilsAppfurnace.storePage(@$popup.children().first())

      @$popup.html($el)#Replace conent
      dfr = jQuery.Deferred()
      $popup = @$popup #Convert to local var
      @$popup.data('popup').o.afterOpen = ()-> dfr.resolve($("body").find(".popup_cont").first())
      @$popup.data('popup').o.afterClose = ()->
        if $popup.children().length > 0
          UtilsAppfurnace.storePage($popup.children().first())

      @$popup.data('popup').open(@$popup)#Show popup
      return dfr.promise()


    #@mehtod
    #@desc: Fires when the player move in a joker point, while the game is running
    onGamePointMoveIn: (coord)=>
      point = @gamefield.getPointByCoord(coord)
      type = @gamefield.getPointTypeName(point.getName())

      #Check if point is visible, and game musst startet
      gameState = @getState()
      if point in @gamefield.getVisiblePoints() and (gameState == Game.gameStates.STARTED or gameState == Game.gameStates.WAITING_FOR_PLAYER)
        @incrementCoins(@gamefield.getCoinPayments())

        if type == Gamefield.pointTypes.COIN
          @onCoinPointMoveIn()
        else if type == Gamefield.pointTypes.JOKER
          @onJokerPointMoveIn()
        else
          throw new Error("Underknow point Type")

    #@method:
    #@desc: Fires when the user tap the ui.btn.currentJoker (right top corner)
    onCurrentJokerClick: ()=>
      self = @
      if @currentJoker == null
        @showPopupContent(UtilsAppfurnace.getPage("Popup.onCurrentJokerClickNoJoker"))
      else
        @showPopupContent(UtilsAppfurnace.getPage("Popup.onCurrentJokerClick")).done ($content)->
          UtilsAppfurnace.getUIElementByName("ui.label.jokerDescription",$content).html(self.currentJoker.getDescription())
          UtilsAppfurnace.getUIElementByName("ui.btn.jokerApply",$content).click(self.currentJoker.applyEffekt)


    #@method
    #@priate
    #@desc: Set the @coin var and update UI
    #@param: {int} increment
    incrementCoins: (increment)=>
      @coins += increment
      @gamefield.getCoinNode().html("Münzen: "+@coins)

    #@method
    #@priate
    #@desc: Fires when the user reach a coin point
    onCoinPointMoveIn: ()=>
      @gamefield.displayNextRound()
      @showPopupContent(UtilsAppfurnace.getPage("Popup.onCoinPointMoveIn"))

    #@method
    #@priate
    #@desc: Fires when the user reach a joker point
    onJokerPointMoveIn: ()=>
      $currentJoker = @gamefield.getJokerNode()
      newJoker = Joker.getRandomJoker()
      @showPopupContent(UtilsAppfurnace.getPage("Popup.onJokerPointMoveIn"))

      #Annimate all joker types
      i = 0
      #@desc: Helper Function, annimates all joker types
      annimateAllJokerTypes = ($node)->
        dfr = $.Deferred()
        Joker.animateImgageNode($node,Joker.jokerTypes.STEAL_COINS).done ()->
            Joker.animateImgageNode($node,Joker.jokerTypes.STEAL_TIME).done ()->
              if i != 2
                annimateAllJokerTypes($node)
              else
                dfr.resolve()#all annimations done
              i+=1
        return dfr.promise()

      #start annimation
      annimateAllJokerTypes($currentJoker).done ()->
        Joker.animateImgageNode($currentJoker,newJoker.getType())#set the random joker

      @currentJoker = newJoker

    #@method
    #@priate
    #@desc: Fires if timer  == 0
    onTimerEnd: ()=>
      @setState(Game.gameStates.TIMER_END)
      @gamefield.hidePoints(@gamefield.getVisiblePoints())#Hide current points
      @gamefield.displayPoint(@gamefield.getStartPoint()) #show start point
      @showPopupContent(UtilsAppfurnace.getPage("Popup.onTimerEnd"))

    #@method
    #@private
    #@event
    onPlayerJoin: ()=>
      @playerCount += 1
      popup("Ein Spieler hat das Spielfeld betreten")

    #@method
    #@private
    #@event
    onPlayerLeft: ()=>
      @playerCount -= 1
      popup("Ein Spieler hat das Spielfeld verlassen")

    #@method
    #@private
    #@event
    onGameStart: ()=>
      @setState(Game.gameStates.STARTED)
      @startTimer()
      @incrementCoins(0)#Update UI-Only
      @gamefield.displayNextRound()
      @showPopupContent(UtilsAppfurnace.getPage("Popup.onGameStart"))

    #@method
    #@private
    #@event
    onGameFinisched: ()=>
      @setState(Game.gameStates.FINISHED)
      @showPopupContent(UtilsAppfurnace.getPage("Popup.onGameFinisched"))


    #@method
    #@private
    #@event
    onZoneMoveIn: ()=>
      if @gameState == Game.gameStates.OUTSIDE_ZONE
        @setState(Game.gameStates.INSIDE_ZONE)
        @showPopupContent(UtilsAppfurnace.getPage('Popup.onZoneMoveIn'))

    #@method
    #@private
    #@event
    onZoneMoveOut: ()=>
      state = @getState()
      if state != Game.gameStates.INSIDE_ZONE
        @showPopupContent(UtilsAppfurnace.getPage('Popup.onZoneMoveOut'))
      else #state == INSIDE_ZONE
        @setState(Game.gameStates.OUTSIDE_ZONE)


    #@method
    #@private
    #@event
    onStartPointMoveIn: ()=>
      self = @
      #Game start message
      state = @getState()
      if state == Game.gameStates.INSIDE_ZONE or state == Game.gameStates.OUTSIDE_ZONE
        @setState(Game.gameStates.ON_STARTPOINT)
        @showPopupContent(UtilsAppfurnace.getPage('Popup.onStartPointMoveIn')).done ($popupContent) ->
          $btn = UtilsAppfurnace.getUIElementByName('ui.btn.GameStart',$popupContent)#Use the popup content to search
          $btn.click(()->
            self.startGame()
          )
      #Game end message
      else if state == Game.gameStates.TIMER_END
        @channel.channel.trigger('client-gameFinisched',data: '')
        @onGameFinisched()


    #@method
    #@private
    #@event
    onStartPointMoveOut: ()=>
      #Check if game stated okay, else display message

    #@mehtod
    #@private
    #@des set the states
    #@param {Game.GameStates} state
    setState: (state) =>
      @gameState = state
    #@mehtod
    #@private
    #@des get the states
    #@return {Game.GameStates} @gameState
    getState: () =>@gameState

    #@method
    #@public
    #@desc called on start of the Game
    startGame: ()=>
      if @channel.channel.trigger("client-startGame", {data: "myData"})
        @onGameStart()



  #Add event ui-bindings
  ui.map.karte1.showFunction(Game.onMapClick)
  ui.map.karte2.showFunction(Game.onMapClick)
  #Return the game class
  return Game


