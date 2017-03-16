RUN OR LOSE
========================

This repository contains a simple run game based on appfurnace platform

1. Install node.js (http://nodejs.org/)
2. install Mimosa with $ npm install -g Mimosa on your command line
3. Clone this repository on your disk


# Start development
 1. Switch with your command line tool (CMD) into your project folder
 2. Use `make start` to start up an asset server and begin coding immediately.
 3. Create your application on the Appfurance Website
 4. Go to the "Code" tab in you application and overwrite all with the following code
 5. Choose your configuration

```javascript
    /*Debug Configuration - BEGIN */
    (function(){
      var t=document.createElement("script");
      t.src="http://localhost:3000/javascripts/vendor/requirejs/require.js";
      t.onload=function(){start();};
      $("body").append(t);
    })();

    start = function (){
        //Load main file
        require(['http://localhost:3000/javascripts/app/main.js'],function(app) {
            return app;
        });
    };


    /*Build Configuration - BEGIN */
    /**
    (function(){
      var t=document.createElement("script");
      t.src="content/main-built.js";
      t.onload=function(){};
      $("body").append(t);
    })();

    */
```

# Build your application
 1. Use `make pack` to create your optimized application. The deployable source will be output to 'public/app/main-built.js' folder.
 2. Open your public/app/main-built.js file and replace "http://localhost:3000/" with none
 3. Upload your public/app/main-built.js and maybe some other Data
 4. Change your configuration
 See the [Mimosa](http://mimosajs.com/) project for details on how to customize the solution and use other features.
