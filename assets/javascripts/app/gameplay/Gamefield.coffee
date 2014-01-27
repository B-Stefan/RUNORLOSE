define ['require', 'baseClasses/RealTimeCommunicationChannel'
        'jquery-popup', 'jquery', "baseClasses/UtilsAppfurnace"],
(require,RealTimeCommunicationChannel, unused, $,UtilsAppfurnace)->

  class Gamefield
    #@static
    #@type: enum
    @pointTypes =
      ZONE: 0
      START: 10
      COIN: 20
      JOKER: 30

    #@static
    #@type: enum
    #@desc: The relative path to the marker images
    @markerImages:
      START: 'images/startpunktODERzielpunkt.png'
      COIN: 'images/checkpointMuenzen.png'
      JOKER: 'images/checkpointJoker.png'

    constructor: (mapId)->
      @name = mapId.replace(" ","")#Replace blanks

      #@private
      #@desc the zone object an gamefield borders
      #@todo Dynamic Zone name by MapID
      # Some issues with the zone name. All zones named "zone" ...:(
      #@private
      @zone = af.geoFeatures.getFeatureByName(@name)
      #@private
      @startPoint = af.geoFeatures.getFeatureByName(@name+'.Start')

      #@type int
      #@desc: The round index for this game
      @round  = 1

      #@private
      #@type <af.GeoFeature>Array()
      #@desc: Contains all points for this gamefield
      @points = af.geoFeatures.getFeatures()


      #@private
      #@desc: The Coin payment per point
      #@type int
      @coinPayments = 2

      @pointsDisplayed = Array()

      #@type int
      #@desc: The round index for this game
      @numberOfPointsOnGamefield  = @getMaxRoundId()
      console.log("@numberOfPointsOnGamefield"+@numberOfPointsOnGamefield)

      #Workarround because the btn not works in the app
      @getBackButtonNode().click ()-> navigate.to("Home")
      @getBackButtonNode().css("z-index",1200)

      #remove zone from list
      ###
      #@todo Remove zone... but this following code cause errors. Zone object => deleted; no events fire
      for point in @points
        if point.getName() == @name
          indexOfZone = @points.indexOf(point)
          @points.splice(indexOfZone, 1) #remove zone form array
          break #Breack because we find the zone
      ###
      @stylePoints()

    #@mehtod
    #@desc: Returns the payment in coins
    getCoinPayments: ()=>
      return @coinPayments

    #@mehtod
    #@desc: Set the payment in coins
    setCoinPayments: (newVal)=>
      @coinPayments = newVal

    #@method
    #@desc: Retuns the round id form the last point
    #@retuns: {int} last round index
    getMaxRoundId: ()=>
      test = true
      virtualRoundIndex = @round
      while test
        @getPointByName("P"+virtualRoundIndex+".1", ()->
            test=false ##exit loop if point not found
        )
        virtualRoundIndex += 1
      return virtualRoundIndex - 1

    #@desc: Get the point type by a complete string
    getPointTypeName: (string) =>
      str = string.substring(@name.length+1).toLowerCase()
      if str == ""
        return Gamefield.pointTypes.ZONE #Very ugly but appfunrance cause some errors if I remove the zone form the pointList
      else if str == 'start'
        return Gamefield.pointTypes.START
      else if  str.substring(str.length-1,str.length) == 'j'
        return Gamefield.pointTypes.JOKER
      else if str.indexOf('p') > -1
        return Gamefield.pointTypes.COIN
      else
        throw new Error("We cant find a Gamefield.pointTpye for the string: " + string)

    #@method
    #@desc: style all points
    stylePoints: ()=>
      for point in @points
        if point.setMarkerImage
          type = @getPointTypeName(point.getName())
          if type == Gamefield.pointTypes.START
            point.setMarkerImage(Gamefield.markerImages.START, 32, 46, "center", "center",false)
          else if type == Gamefield.pointTypes.COIN
            point.setMarkerImage(Gamefield.markerImages.COIN, 32, 46, "center", "center",false)
          else if type == Gamefield.pointTypes.JOKER
            point.setMarkerImage(Gamefield.markerImages.JOKER, 32, 46, "center", "center",false)



    #@method
    #@public
    #@desc: Set the event for all points except the start point and Zone
    #@prams: {function} onGamePointMoveIn:
    setAllPointsMoveIn: (onGamePointMoveIn)=>
      for point in @getPoints()
        type = @getPointTypeName(point.getName())
        if type != Gamefield.pointTypes.START and type != Gamefield.pointTypes.ZONE
          point.setMovein(onGamePointMoveIn)


    #@method
    #@return: {<af.GeoFeature>Array} Points that the user see
    getVisiblePoints: ()=> @pointsDisplayed

    #@method
    #@return: {<af.GeoFeature>Array} All points
    getPoints: ()=> @points


    #@method
    #@param: {af.GeoFeature.Coord} coord: A af coord object
    #@returns {af.GeoFeature.Point} point
    getPointByCoord: (coord)=>
      for point in @points
        if @getPointTypeName(point.getName()) != Gamefield.pointTypes.ZONE
          if point.contains(coord)
            return point

      throw new Error("We cant find a point at coord: x:"+coord.x+"y:"+coord.y)

    #@method
    #@param: {string} name: The public name of the point
    #@param: {function} exeptionHandler: Handle the not found exepetion for the point
    #@returns {af.GeoFeature} point,
    getPointByName: (name, exeptionHandler)=>
      #Set default handle r
      exeptionHandler = exeptionHandler ? (name)-> throw new Error("We cant find the point with the name: "+name )

      name = name.toLowerCase()
      for point in @points
        pointName = point.getName()
        pointName = pointName.substring(@name.length+1).toLowerCase()#Remove mapname
        pointName = pointName.replace("j","")#Remove joker marker
        if pointName == name
          return point

      exeptionHandler(name)



    #@method
    #@returns {<af.GeoFeature>Array} Array of the next 2 points
    #@desc: Increment the round and returns the next 2 points
    getNextPoints: ()=>
      #Start over when all points allready played
      if @numberOfPointsOnGamefield == @round
        @round = 1

      arr = [@getPointByName("P"+@round+".1"),@getPointByName("P"+@round+".2")]
      @round +=1
      return arr

    #@method
    #@returns void
    #@desc: Display the next round
    displayNextRound: ()=>
      next = @getNextPoints()
      @hidePoints(@getVisiblePoints())
      @displayPoints(next)


    getStartPoint: ()=> @getPointByName("Start")

    #@des: Display a single point on the map
    displayPoint: (point)=> @displayPoints([point])
    #@des: Display a array of points on the map
    #@param: {array} points: point array
    displayPoints: (points)=>
      for point in points
        point.setMarkerVisible(true);
        @pointsDisplayed.push(point)

    #@des: Hide a single point on the map
    hidePoint: (point)=> @hidePoints([point])
    #@des: Hide a array of points on the map
    #@param: {array} points: point array
    hidePoints: (points)=>
      for point in points
        point.setMarkerVisible(false);
        @pointsDisplayed = @pointsDisplayed.slice(@pointsDisplayed.indexOf(point),1)

    userInsideZone: ()=> @zone.userInside()
    setZoneMoveIn: (handler)=> @zone.setMovein(handler) #Add binding handler for move in
    setZoneMoveOut: (handler)=>@zone.setMoveout(handler) #Add binding handler for move in

    setStartPointMoveIn: (handler)=> @startPoint.setMovein(handler) #Add binding handler for move in
    setStartPointMoveOut: (handler)=> @startPoint.setMoveout(handler) #Add binding handler for move in
    getTimerNode: ()=>UtilsAppfurnace.getUIElementByName("ui.label.timer",UtilsAppfurnace.getPage(@name)).find(".vcenterable").first()
    getCoinNode: ()=> UtilsAppfurnace.getUIElementByName("ui.label.coins",UtilsAppfurnace.getPage(@name)).find(".vcenterable").first()
    getJokerNode: ()=> UtilsAppfurnace.getUIElementByName("ui.btn.currentJoker",UtilsAppfurnace.getPage(@name)).find(".label").first()
    getBackButtonNode: ()=> UtilsAppfurnace.getUIElementByName("ui.btn.back",UtilsAppfurnace.getPage(@name)).find(".label").first()

    getDefaultTime: ()=> 10000000 #-> in ms <=> 3 min.