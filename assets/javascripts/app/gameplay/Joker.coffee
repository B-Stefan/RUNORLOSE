define ['jquery',
        'moment',
        'baseClasses/UtilsAppfurnace'],
($,moment,UtilsAppfurnace)->
  class Joker
    #@static
    #@type: enum
    @jokerTypes:
      STEAL_COINS: 'STEAL_COINS'
      STEAL_TIME: 'STEAL_TIME'
      COIN_MULTI: 'COIN_MULTI'

    #@static
    #@type: enum
    #@desc: The path to the joker images
    @jokerImages:
      STEAL_COINS: 'content/images/MuenzWechsel.png'
      STEAL_TIME: 'content/images/MINUSZeit.png'
      COIN_MULTI: 'content/images/riegelx2.png'

    #@staic
    #@desc: Detect joker type and fire the spesific event. Binding in the Game.class
    @onJokerEventTrigger: (game,data = {})=>
      if not data.type
        throw new Error("No type pased")
        return
      else if not @jokerTypes[data.type]
        throw nre Error ("No valid type" + data.type)
        return
      Joker["onJoker"+data.type](game,game.gamefield)


    #@event
    #@desct fires when an other team apply the joker
    @onJokerSTEAL_TIME: (game,gamefield)->
      facator = 0.9
      delta = Math.floor(game.getRemainingTime()*facator)
      game.setRemainingTime(delta) #10 percent less
      game.showPopupContent(UtilsAppfurnace.getPage("joker.STEAL_Time.applyInfo")).done ($cont)->
        UtilsAppfurnace.getUIElementByName("ui.label.howManyTime",$cont).html(moment(delta).format("mm:ss"))


    #@event
    #@desct fires when an other team apply the joker
    @onJokerSTEAL_COINS: (game,gamefield)->
      console.log("onJokerSTEAL_COINS")
      facator = 0.9
      delta = Math.floor(game.getCoins()*facator)
      game.setCoins(delta) #10 percent less
      game.showPopupContent(UtilsAppfurnace.getPage("joker.STEAL_COINS.applyInfo")).done ($cont)->
        UtilsAppfurnace.getUIElementByName("ui.label.howManyCoins",$cont).html(delta)

    #@event
    #@desct fires when an other team apply the joker
    @onJokerCOIN_MULTI: (game,gamefield)->
      console.log("JOKER TRIGGER2")
      gamefield.setCoinPayments(gamefield.getCoinPayments() * 2)
      intVal = window.setInterval(()->
        gamefield.setCoinPayments(Math.floor(gamefield.getCoinPayments()/2))
        game.showPopupContent(UtilsAppfurnace.getPage("joker.COIN_MULTI.applyInfo"))
        window.clearInterval(intVal)
      ,100000)

    #@method
    #@param: {Joker.jokerType} jokerType
    @getImageNode:(jokerType, options = {width: 70,height:70})->
      url = Joker.jokerImages[jokerType]
      if url == undefined
        throw new Error("We cant an image path to Joker.jokerTypes: "+jokerType)

      $imgNode = $("<img \>")
      $imgNode.attr('src',url)
      $imgNode.attr('width',options.width)
      $imgNode.attr('height',options.height)
      $imgNode.css("vertical-align",'middle')
      return $imgNode

    #@method
    #@static
    #@desc: Annimate the param $imageNode
    #@param: {jQuery.Element} $Node: The jquery html node
    #@param: {Joker.jokerType} jokerType: The Type to be show
    #@return: jQuery.Promise
    @animateImgageNode:($node, jokerType)->
      dfr = $.Deferred()
      $node.animate({"opacity": "0"}, 400).promise().done ()->
        $node.html(Joker.getImageNode(jokerType))
        $node.animate({"opacity": "1"}, 400).promise().done (event)->
          dfr.resolve()

    #@method
    #@static
    #@desc: Return an new random Joker instance (random type)
    @getRandomJoker: ()->
      length = 0
      for key of Joker.jokerTypes
        length +=1

      randomIndex = Math.floor(Math.random() * length)
      i = 0
      for key,value of Joker.jokerTypes
        if i == randomIndex
          return new Joker(value)
        else
          i +=1


    #@constructor
    #@param: {Joker.jokerTypes} jokerType: The type of the new joker
    constructor: (jokerType)->

      #@private
      #@type: Joker.jokerType
      @type = jokerType

    #@method
    #@public
    applyEffekt: (game)=>
      if @getType() == Joker.jokerTypes.COIN_MULTI
        Joker.onJokerCOIN_MULTI(game,game.gamefield)
      else
        game.channel.channel.trigger('client-joker', {
          joker: @
          type: @getType()

        })

    #@method
    #@public
    #@retun {Joker.jokerType} type
    getType: ()=> @type

    #@method
    #@returns: {JQuery.Element} The description page
    getDescription: ()=>
      $original = UtilsAppfurnace.getPage("Popup.Joker."+@getType()+".info")
      $clone = $original.clone()
      UtilsAppfurnace.storePage($original)
      return $clone
    #@method
    #@return {jQury.Element} image node
    getImageNode: ()=> Joker.getImageNode(@getType())
