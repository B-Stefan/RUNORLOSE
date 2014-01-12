define ['jquery',
        'baseClasses/UtilsAppfurnace'],
($,UtilsAppfurnace)->
  class Joker
    #@static
    #@type: enum
    @jokerTypes:
      STEAL_COINS: 'STEAL_COINS'
      STEAL_TIME: 'STEAL_TIME'

    #@static
    #@type: enum
    #@desc: The path to the joker images
    @jokerImages:
      STEAL_COINS: 'content/images/MuenzWechsel.png'
      STEAL_TIME: 'content/images/MINUSZeit.png'

    #@event
    #@desct fires when an other team apply the joker
    @onJokerSTEAL_TIME: (game,gamefield)->
      game.setRemainingTime(game.getRemainingTime()*0.9) #10 percent less

    #@event
    #@desct fires when an other team apply the joker
    @onJokerSTEAL_COINS: (game,gamefield)->
      facator = 0.9
      game.setCoins(game.getCoins()*facator) #10 percent less
      game.showPopupContent(UtilsAppfurnance.getPage("joker.STEAL_COINS.applyInfo")).done ($cont)->
        UtilsAppfurnance.getUIElementByName("label.howMany",$cont).html(game.getCoins()* 1 + (1-facator))


    #@method
    #@param: {Joker.jokerType} jokerType
    @getImageNode:(jokerType, options = {width: 21,height:21})->
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
      game.channel.channel.trigger('client-joker-'+ @type, {joker: @})
      game.showPopupContent(UtilsAppfurnace.getPage("Popup.JokerApplied"))


    #@method
    #@public
    #@retun {Joker.jokerType} type
    getType: ()=> @type

    #@method
    #@returns: {JQuery.Element} The description page
    getDescription: ()=>
      UtilsAppfurnace.getPage("Popup.Joker."+@getType()+".info")
    #@method
    #@return {jQury.Element} image node
    getImageNode: ()=> Joker.getImageNode(@getType())
