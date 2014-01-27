define ['require',
        'baseClasses/RealTimeCommunicationChannel'
        'jquery-popup',
        'jquery',
        'gameplay/Gamefield',
        'gameplay/GameRecorder'
        'baseClasses/UtilsAppfurnace',
        'moment',
        'gameplay/Joker'
],

(require,RealTimeCommunicationChannel, unused, $,Gamefield,GameRecorder,UtilsAppfurnace,moment,Joker)->
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

      Game.currentGame = new Game(this.name(), recorder: true)
      #Do something with the player
      console.log(['onMapShow',arguments, this.uid()])
      window.game = Game.currentGame

    #@constructor
    #@param {string} the map id
    #@param {boolean} options.recorder If true the game will create a record of all events
    constructor: (mapId, options = {})->
      self = @
      @setState(Game.gameStates.OUTSIDE_ZONE)

      #@private
      #@type int
      #@desc the unique id of the game
      @id = Math.floor(Math.random()*10000)

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

      @otherPlayer = []

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
        #Bin Joker events
        self.channel.channel.bind("client-joker", (data)-> Joker.onJokerEventTrigger(self,data))


      #Check options
      if options.recorder == true
        @recorder = new GameRecorder(@)
      else
        @recorder = false

    #@method
    #@desc: Called if the game destroyed
    destroy:()=> console.log(["Game destroyed", @])

    #@method
    #@public
    #@retuns int
    #@desc retuns the current remining time
    getRemainingTime: ()=> @remainingTime

    #@method
    #@public
    #@param {int} new value
    #@desc set the current remining time
    setRemainingTime: (newVal)=> @remainingTime = newVal

    #@method
    #@public
    #@param {int} new coin val
    #@desc Set the coin val
    setCoins: (newVal)=>
      @coins = newVal
      @incrementCoins(0)

    #@mehtod
    #@returns {int}
    getCoins: ()=> @coins
    #@method
    #@public
    getId:()=> @id
    #@method
    #@private
    #@desc: Start the internal timer and update every interval the display
    startTimer: ()=>
      startTime = moment()
      self = @
      timer   = window.setInterval(()->
        self.remainingTime = Math.floor(self.remainingTime) -  1000
        if self.remainingTime < 60000 and self.remainingTime >= 59000 #remainingTime is less than 1 minute (Range because the joker time steal effekt)
          self.onLastMinuteBegun()
        if self.remainingTime < 30000 and self.remainingTime >= 29000 #remainingTime is less than 1 minute (Range because the joker time steal effekt)
          self.onLast30SecondsBegun()
        else if self.remainingTime <= 0
          clearInterval(timer)
          self.remainingTime = 0
          self.onTimerEnd()
        self.gamefield.getTimerNode().html("Zeit: "+moment(self.remainingTime).format("mm:ss"))

      ,1000)

    #@mehtod
    vibrate: ()=> navigator.notification.vibrate(1000)
    #@mehtod
    #@private
    #@desc Called when the last minute is reached
    onLastMinuteBegun: ()=>

    #@mehtod
    #@private
    #@desc Called when the last 30 seconds is reached
    onLast30SecondsBegun: ()=>
      af.audioChannel.init(1)
      af.audioChannel.add(0, "sounds/24Effect.mp3")

    #@method
    #@priate
    #@parms {jQuery.Elememt | string} $el
    #@retuns {jQuery.Promise}
    showPopupContent: ($el) =>
      #Cover the old views
      self = @
      if @$popup.children().length > 0
        UtilsAppfurnace.storePage(@$popup.children().first())

      @$popup.html($el)#Replace conent
      $el.hide()
      dfr = jQuery.Deferred()
      $popup = @$popup #Convert to local var
      @$popup.data('popup').o.afterOpen = ()->
        $popContent = $("body").find(".popup_cont").first()
        dfr.resolve($popContent)
        $btn = UtilsAppfurnace.getUIElementByName('ui.btn.Close',$popContent)#Use the popup content to search

        for i in [1..10] #range from 1--> 10
          if $btn.length == 0
            $btn = UtilsAppfurnace.getUIElementByName('ui.btn.Close'+i,$popContent)
          else
            break
        $btn.find(".label").click(()->
          self.closePopup()
        )
      @$popup.data('popup').o.afterClose = ()->
        if $popup.children().length > 0
          UtilsAppfurnace.storePage($popup.children().first())

      @$popup.data('popup').open($el)#Show popup
      return dfr.promise()


    #@method
    #@desc: Hide the popup
    #@param: {$} [$el = @$popup]: The popup to close
    closePopup:($el = @$popup)=>
      @$popup.data("popup").close($el)


    #@mehtod
    #@desc: Fires when the player move in a joker point, while the game is running
    onGamePointMoveIn: (coord)=>
      point = @gamefield.getPointByCoord(coord)
      type = @gamefield.getPointTypeName(point.getName())
      #Check if point is visible, and game musst startet
      gameState = @getState()
      if point in @gamefield.getVisiblePoints() and (gameState == Game.gameStates.STARTED or gameState == Game.gameStates.WAITING_FOR_PLAYER)

        @vibrate()
        #Type switch
        if type == Gamefield.pointTypes.COIN
          @incrementCoins(@gamefield.getCoinPayments())
          @onCoinPointMoveIn()
        else if type == Gamefield.pointTypes.JOKER
          @onJokerPointMoveIn()
        else
          throw new Error("Underknow point Type")

    #@method
    #@priate
    #@desc: Set the @coin var and update UI
    #@param: {int} increment
    incrementCoins: (increment)=>
      @coins += increment
      if @recorder
        @recorder.recordGameEvent(GameRecorder.recordTypes.COIN,
          coinVal: @coins)
      @gamefield.getCoinNode().html("Powerriegel: "+@coins)

    #@method
    #@priate
    #@desc: Fires when the user reach a coin point
    onCoinPointMoveIn: ()=>
      self = @
      @gamefield.displayNextRound()
      @showPopupContent(UtilsAppfurnace.getPage("Popup.onCoinPointMoveIn")).done ($content)->
        #Display the current coin payment
        UtilsAppfurnace.getUIElementByName("ui.label.PointMoveIn.howMany",$content).text(self.gamefield.getCoinPayments())



    #@method
    #@priate
    #@desc: Fires when the user reach a joker point
    onJokerPointMoveIn: ()=>
      self = @
      @showPopupContent(UtilsAppfurnace.getPage("Popup.onJokerPointMoveIn")).done ($content)->
        $node = UtilsAppfurnace.getUIElementByName("ui.label.jokerNode",$content)
        $annimationNode = $("<div></div>")

        $node.css("background-color", '#3e8e8e')
        $node.css("border-color", 'black')
        $node.css("padding", '10px')
        $node.html("")
        $node.append($annimationNode)



        #Annimate all joker types
        i = 0
        #@desc: Helper Function, annimates all joker types
        dfrGlobal = $.Deferred()#Set global because some errors by call recusive the same function. I guess some local scope override of the dfr var
        annimateAllJokerTypes = ($nodeToAnnimate)->
          dfr = $.Deferred()
          Joker.animateImgageNode($nodeToAnnimate,Joker.jokerTypes.COIN_MULTI).done ()->
            Joker.animateImgageNode($nodeToAnnimate,Joker.jokerTypes.STEAL_COINS).done ()->
                Joker.animateImgageNode($nodeToAnnimate,Joker.jokerTypes.STEAL_TIME).done ()->
                  if i != 2
                    annimateAllJokerTypes($nodeToAnnimate).done ()->
                      dfrGlobal.resolve()
                  else
                    dfr.resolve()#all annimations done
                  i+=1
          return dfr.promise()

        #start annimation
        annimateAllJokerTypes($annimationNode)

        dfrGlobal.done ()->
          newJoker = Joker.getRandomJoker()

          Joker.animateImgageNode($annimationNode,newJoker.getType()).done ()->
            $jokerDescription = UtilsAppfurnace.getUIElementByName("ui.label.jokerDescription",$content)
            $jokerDescription.html(newJoker.getDescription())
            newJoker.applyEffekt(self)




    #@method
    #@priate
    #@desc: Fires if timer  == 0
    onTimerEnd: ()=>

      @setState(Game.gameStates.TIMER_END)
      af.audioChannel.clear(0) #Stop sound
      @gamefield.hidePoints(@gamefield.getVisiblePoints())#Hide current points
      @gamefield.displayPoint(@gamefield.getStartPoint()) #show start point
      @showPopupContent(UtilsAppfurnace.getPage("Popup.onTimerEnd"))

    #@method
    #@private
    #@event
    onPlayerJoin: (player)=>
      @playerCount += 1
      popup("Ein Spieler hat das Spielfeld betreten")

    #@method
    #@private
    #@event
    onPlayerLeft: (player)=>
      @playerCount -= 1

      popup("Ein Spieler hat das Spielfeld verlassen")


    #@method
    #@private
    #@event
    onGameStart: ()=>
      self = @
      @setState(Game.gameStates.STARTED)
      @startCountdown().done ()->
        self.startTimer()
        self.incrementCoins(0)#Update UI-Only
        self.gamefield.displayNextRound()
        #self.showPopupContent(UtilsAppfurnace.getPage("Popup.onGameStart"))

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
          $btn.click ()-> self.startGame()





      #Game end message
      else if state == Game.gameStates.TIMER_END
        @incrementCoins(@gamefield.getCoinPayments())#First player gets the last Powerriegel
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
    #@private
    #@desc Count from ten back and display an annimation
    #@returns promise

    startCountdown:()=>
      self = @
      dfr = $.Deferred()
      af.audioChannel.init(1)
      af.audioChannel.add(0, "sounds/startCountdown.mp3")

      $countdown = $('<div style="text-align: center; vertical-align: middle; display: table-cell; width: 200px; height: 200px"></div>')
      @showPopupContent($("<div></div>")).done ($popup)->
        $content = $popup.find(".popup_content")
        $countdown = $('<div style="text-align: center; vertical-align: middle; display: table-cell"></div>')
        $countdown.width($content.width())
        $countdown.height($content.height())
        $content.append($countdown)
        self.$popup.data("popup").center()

        #ten seconds timer
        i = 10
        int = setInterval( () ->
          if i ==-1
            clearInterval(int)
            self.closePopup()
            dfr.resolve()
            return
          $countdown.css('opacity', 0.25);
          $countdown.css('font-size', '2em');

          if i == 0
            $countdown.text("GO!")
            $countdown.css('opacity', 1);
          else
            $countdown.text(i);

          $countdown.animate(
            {
              opacity: 1,
              fontSize: '6em'
            },
            800)
          i--

        , 890)

      return dfr.promise()
    #@method
    #@public
    #@desc called on start of the Game
    startGame: ()=>
      if @channel.channel.trigger("client-startGame", {data: "myData"})
        if @recorder
          @recorder.startGameRecorder();
        @onGameStart()



