/**
 * Some configs for require.js
 *
 * **/
requirejs.config({
    baseUrl: "http://localhost:3000/javascripts/app/",
    paths: {
        'text': '../vendor/requirejs-text/text',
        'jquery': '../vendor/jquery/jquery', //important! If you update jquery replace 'window.jQuery = window.$ = jQuery;' with 'window.jQuery  = jQuery;'
        'parse': '../vendor/parse/parse-1.2.12',
        'pusher': '../vendor/pusher/2.1-pusher.min',
        'jquery-popup': '../vendor/jquery.popup/js/jquery.popup',
        'css': '../vendor/require-css/css',
        'css-builder': '../vendor/require-css/css-builder',
        'normalize': '../vendor/require-css/normalize',
        'moment': '../vendor/moment/moment'
    },
    shim: {
        'parse': {
            exports: "Parse",
            init: function () {
                //Get your Application ID and JavaScript key from https://parse.com/apps/quickstart
                Parse.initialize("vIHwlKIJUX1pzQZKlPcstRhEbazv8uHNl3mwdqyz", "jN3LZyWX5nQogcFNh8w0oWYGFpnHfzCsqFQMQUoU");
            }
        },
        'jquery-popup': {
            deps: ['jquery', 'css!../vendor/jquery.popup/css/popup.css']
        },
        'pusher': {
            exports: 'Pusher'
        }
    }
});
/**
 * @module main
 * @desc called by appfurnace to start the application. Do some init stuff
 */
define(['require',
    'gameplay/Game',
    'baseClasses/UtilsAppfurnace',
    'baseClasses/RealTimeCommunicationChannel',
    'jquery-popup', 'jquery'], function (require, Game,UtilsAppfurnace, RealTimeCommunicationChannel, unused, $) {


    //Bind click funtions to class 
    ui.map.karte1.showFunction(Game.onMapClick)
    ui.map.karte2.showFunction(Game.onMapClick)

    //Bind click to image on home Page
    /*$page = UtilsAppfurnace.getPage("Home")
    UtilsAppfurnace.getUIElementByName("ui.image.Karte1",$page).click(function(){
        navigate.to("Karte1")
    })
    UtilsAppfurnace.storePage($page)
*/
    //>>excludeStart("build", true);
    //navigate.to("Karte1")
    //>>excludeEnd("build");



});
