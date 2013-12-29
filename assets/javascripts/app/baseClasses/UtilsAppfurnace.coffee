define ['jquery'], ($)->
  #Returns a static complte Static class
  class
    #@param {string} pageName the public name of the page
    #@des Find the dom element and remove some internal classes
    #@retuns {jQuery.element|$} The page dom object for the pageName
    @getPage: (pageName)->
      $page = $("body").find("div[data-name='"+pageName+"']").first()
      #Remove some interal appfurnace classes ...
      $page.removeClass("content")
      $page.removeClass("widget")
      $page.removeClass("page")

      return $page
    #@param: {jQuery.Element} $page: The page Element to store in dom
    #@desc: Append the removed classes and store the page into the page dom node
    #@return void
    @storePage: ($page)->
      $page.addClass("content")
      $page.addClass("widget")
      $page.addClass("page")
      $('#pages').append($page)


    #@param {string} uiName:  The internal name of the ui element
    #@pram {jQuery.Element} $el: The Element in to search. For example @getUIElementByName("ui.btn.onGameStart", @getPage("onStartPointMoveIn"))
    #@retuns {jQuery.element|$} The UI-element
    @getUIElementByName: (uiName, $el)->
      return $el.find("[data-var='"+uiName+"']").first()

