var requirejs,require,define;!function(global){function isFunction(e){return"[object Function]"===ostring.call(e)}function isArray(e){return"[object Array]"===ostring.call(e)}function each(e,t){if(e){var n;for(n=0;n<e.length&&(!e[n]||!t(e[n],n,e));n+=1);}}function eachReverse(e,t){if(e){var n;for(n=e.length-1;n>-1&&(!e[n]||!t(e[n],n,e));n-=1);}}function hasProp(e,t){return hasOwn.call(e,t)}function getOwn(e,t){return hasProp(e,t)&&e[t]}function eachProp(e,t){var n;for(n in e)if(hasProp(e,n)&&t(e[n],n))break}function mixin(e,t,n,i){return t&&eachProp(t,function(t,r){(n||!hasProp(e,r))&&(i&&"string"!=typeof t?(e[r]||(e[r]={}),mixin(e[r],t,n,i)):e[r]=t)}),e}function bind(e,t){return function(){return t.apply(e,arguments)}}function scripts(){return document.getElementsByTagName("script")}function defaultOnError(e){throw e}function getGlobal(e){if(!e)return e;var t=global;return each(e.split("."),function(e){t=t[e]}),t}function makeError(e,t,n,i){var r=new Error(t+"\nhttp://requirejs.org/docs/errors.html#"+e);return r.requireType=e,r.requireModules=i,n&&(r.originalError=n),r}function newContext(e){function t(e){var t,n;for(t=0;e[t];t+=1)if(n=e[t],"."===n)e.splice(t,1),t-=1;else if(".."===n){if(1===t&&(".."===e[2]||".."===e[0]))break;t>0&&(e.splice(t-1,2),t-=2)}}function n(e,n,i){var r,s,a,o,u,c,l,d,h,p,f,_=n&&n.split("/"),m=_,g=w.map,y=g&&g["*"];if(e&&"."===e.charAt(0)&&(n?(m=getOwn(w.pkgs,n)?_=[n]:_.slice(0,_.length-1),e=m.concat(e.split("/")),t(e),s=getOwn(w.pkgs,r=e[0]),e=e.join("/"),s&&e===r+"/"+s.main&&(e=r)):0===e.indexOf("./")&&(e=e.substring(2))),i&&g&&(_||y)){for(o=e.split("/"),u=o.length;u>0;u-=1){if(l=o.slice(0,u).join("/"),_)for(c=_.length;c>0;c-=1)if(a=getOwn(g,_.slice(0,c).join("/")),a&&(a=getOwn(a,l))){d=a,h=u;break}if(d)break;!p&&y&&getOwn(y,l)&&(p=getOwn(y,l),f=u)}!d&&p&&(d=p,h=f),d&&(o.splice(0,h,d),e=o.join("/"))}return e}function i(e){isBrowser&&each(scripts(),function(t){return t.getAttribute("data-requiremodule")===e&&t.getAttribute("data-requirecontext")===b.contextName?(t.parentNode.removeChild(t),!0):void 0})}function r(e){var t=getOwn(w.paths,e);return t&&isArray(t)&&t.length>1?(i(e),t.shift(),b.require.undef(e),b.require([e]),!0):void 0}function s(e){var t,n=e?e.indexOf("!"):-1;return n>-1&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function a(e,t,i,r){var a,o,u,c,l=null,d=t?t.name:null,h=e,p=!0,f="";return e||(p=!1,e="_@r"+(x+=1)),c=s(e),l=c[0],e=c[1],l&&(l=n(l,d,r),o=getOwn(Y,l)),e&&(l?f=o&&o.normalize?o.normalize(e,function(e){return n(e,d,r)}):n(e,d,r):(f=n(e,d,r),c=s(f),l=c[0],f=c[1],i=!0,a=b.nameToUrl(f))),u=!l||o||i?"":"_unnormalized"+(E+=1),{prefix:l,name:f,parentMap:t,unnormalized:!!u,url:a,originalName:h,isDefine:p,id:(l?l+"!"+f:f)+u}}function o(e){var t=e.id,n=getOwn(T,t);return n||(n=T[t]=new b.Module(e)),n}function u(e,t,n){var i=e.id,r=getOwn(T,i);!hasProp(Y,i)||r&&!r.defineEmitComplete?(r=o(e),r.error&&"error"===t?n(r.error):r.on(t,n)):"defined"===t&&n(Y[i])}function c(e,t){var n=e.requireModules,i=!1;t?t(e):(each(n,function(t){var n=getOwn(T,t);n&&(n.error=e,n.events.error&&(i=!0,n.emit("error",e)))}),i||req.onError(e))}function l(){globalDefQueue.length&&(apsp.apply(D,[D.length-1,0].concat(globalDefQueue)),globalDefQueue=[])}function d(e){delete T[e],delete k[e]}function h(e,t,n){var i=e.map.id;e.error?e.emit("error",e.error):(t[i]=!0,each(e.depMaps,function(i,r){var s=i.id,a=getOwn(T,s);!a||e.depMatched[r]||n[s]||(getOwn(t,s)?(e.defineDep(r,Y[s]),e.check()):h(a,t,n))}),n[i]=!0)}function p(){var e,t,n,s,a=1e3*w.waitSeconds,o=a&&b.startTime+a<(new Date).getTime(),u=[],l=[],d=!1,f=!0;if(!y){if(y=!0,eachProp(k,function(n){if(e=n.map,t=e.id,n.enabled&&(e.isDefine||l.push(n),!n.error))if(!n.inited&&o)r(t)?(s=!0,d=!0):(u.push(t),i(t));else if(!n.inited&&n.fetched&&e.isDefine&&(d=!0,!e.prefix))return f=!1}),o&&u.length)return n=makeError("timeout","Load timeout for modules: "+u,null,u),n.contextName=b.contextName,c(n);f&&each(l,function(e){h(e,{},{})}),o&&!s||!d||!isBrowser&&!isWebWorker||L||(L=setTimeout(function(){L=0,p()},50)),y=!1}}function f(e){hasProp(Y,e[0])||o(a(e[0],null,!0)).init(e[1],e[2])}function _(e,t,n,i){e.detachEvent&&!isOpera?i&&e.detachEvent(i,t):e.removeEventListener(n,t,!1)}function m(e){var t=e.currentTarget||e.srcElement;return _(t,b.onScriptLoad,"load","onreadystatechange"),_(t,b.onScriptError,"error"),{node:t,id:t&&t.getAttribute("data-requiremodule")}}function g(){var e;for(l();D.length;){if(e=D.shift(),null===e[0])return c(makeError("mismatch","Mismatched anonymous define() module: "+e[e.length-1]));f(e)}}var y,v,b,M,L,w={waitSeconds:7,baseUrl:"./",paths:{},pkgs:{},shim:{},config:{}},T={},k={},S={},D=[],Y={},P={},x=1,E=1;return M={require:function(e){return e.require?e.require:e.require=b.makeRequire(e.map)},exports:function(e){return e.usingExports=!0,e.map.isDefine?e.exports?e.exports:e.exports=Y[e.map.id]={}:void 0},module:function(e){return e.module?e.module:e.module={id:e.map.id,uri:e.map.url,config:function(){var t,n=getOwn(w.pkgs,e.map.id);return t=n?getOwn(w.config,e.map.id+"/"+n.main):getOwn(w.config,e.map.id),t||{}},exports:Y[e.map.id]}}},v=function(e){this.events=getOwn(S,e.id)||{},this.map=e,this.shim=getOwn(w.shim,e.id),this.depExports=[],this.depMaps=[],this.depMatched=[],this.pluginMaps={},this.depCount=0},v.prototype={init:function(e,t,n,i){i=i||{},this.inited||(this.factory=t,n?this.on("error",n):this.events.error&&(n=bind(this,function(e){this.emit("error",e)})),this.depMaps=e&&e.slice(0),this.errback=n,this.inited=!0,this.ignore=i.ignore,i.enabled||this.enabled?this.enable():this.check())},defineDep:function(e,t){this.depMatched[e]||(this.depMatched[e]=!0,this.depCount-=1,this.depExports[e]=t)},fetch:function(){if(!this.fetched){this.fetched=!0,b.startTime=(new Date).getTime();var e=this.map;return this.shim?(b.makeRequire(this.map,{enableBuildCallback:!0})(this.shim.deps||[],bind(this,function(){return e.prefix?this.callPlugin():this.load()})),void 0):e.prefix?this.callPlugin():this.load()}},load:function(){var e=this.map.url;P[e]||(P[e]=!0,b.load(this.map.id,e))},check:function(){if(this.enabled&&!this.enabling){var e,t,n=this.map.id,i=this.depExports,exports=this.exports,r=this.factory;if(this.inited){if(this.error)this.emit("error",this.error);else if(!this.defining){if(this.defining=!0,this.depCount<1&&!this.defined){if(isFunction(r)){if(this.events.error&&this.map.isDefine||req.onError!==defaultOnError)try{exports=b.execCb(n,r,i,exports)}catch(s){e=s}else exports=b.execCb(n,r,i,exports);if(this.map.isDefine&&(t=this.module,t&&void 0!==t.exports&&t.exports!==this.exports?exports=t.exports:void 0===exports&&this.usingExports&&(exports=this.exports)),e)return e.requireMap=this.map,e.requireModules=this.map.isDefine?[this.map.id]:null,e.requireType=this.map.isDefine?"define":"require",c(this.error=e)}else exports=r;this.exports=exports,this.map.isDefine&&!this.ignore&&(Y[n]=exports,req.onResourceLoad&&req.onResourceLoad(b,this.map,this.depMaps)),d(n),this.defined=!0}this.defining=!1,this.defined&&!this.defineEmitted&&(this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=!0)}}else this.fetch()}},callPlugin:function(){var e=this.map,t=e.id,i=a(e.prefix);this.depMaps.push(i),u(i,"defined",bind(this,function(i){var r,s,l,h=this.map.name,p=this.map.parentMap?this.map.parentMap.name:null,f=b.makeRequire(e.parentMap,{enableBuildCallback:!0});return this.map.unnormalized?(i.normalize&&(h=i.normalize(h,function(e){return n(e,p,!0)})||""),s=a(e.prefix+"!"+h,this.map.parentMap),u(s,"defined",bind(this,function(e){this.init([],function(){return e},null,{enabled:!0,ignore:!0})})),l=getOwn(T,s.id),l&&(this.depMaps.push(s),this.events.error&&l.on("error",bind(this,function(e){this.emit("error",e)})),l.enable()),void 0):(r=bind(this,function(e){this.init([],function(){return e},null,{enabled:!0})}),r.error=bind(this,function(e){this.inited=!0,this.error=e,e.requireModules=[t],eachProp(T,function(e){0===e.map.id.indexOf(t+"_unnormalized")&&d(e.map.id)}),c(e)}),r.fromText=bind(this,function(n,i){var s=e.name,u=a(s),l=useInteractive;i&&(n=i),l&&(useInteractive=!1),o(u),hasProp(w.config,t)&&(w.config[s]=w.config[t]);try{req.exec(n)}catch(d){return c(makeError("fromtexteval","fromText eval for "+t+" failed: "+d,d,[t]))}l&&(useInteractive=!0),this.depMaps.push(u),b.completeLoad(s),f([s],r)}),i.load(e.name,f,r,w),void 0)})),b.enable(i,this),this.pluginMaps[i.id]=i},enable:function(){k[this.map.id]=this,this.enabled=!0,this.enabling=!0,each(this.depMaps,bind(this,function(e,t){var n,i,r;if("string"==typeof e){if(e=a(e,this.map.isDefine?this.map:this.map.parentMap,!1,!this.skipMap),this.depMaps[t]=e,r=getOwn(M,e.id))return this.depExports[t]=r(this),void 0;this.depCount+=1,u(e,"defined",bind(this,function(e){this.defineDep(t,e),this.check()})),this.errback&&u(e,"error",bind(this,this.errback))}n=e.id,i=T[n],hasProp(M,n)||!i||i.enabled||b.enable(e,this)})),eachProp(this.pluginMaps,bind(this,function(e){var t=getOwn(T,e.id);t&&!t.enabled&&b.enable(e,this)})),this.enabling=!1,this.check()},on:function(e,t){var n=this.events[e];n||(n=this.events[e]=[]),n.push(t)},emit:function(e,t){each(this.events[e],function(e){e(t)}),"error"===e&&delete this.events[e]}},b={config:w,contextName:e,registry:T,defined:Y,urlFetched:P,defQueue:D,Module:v,makeModuleMap:a,nextTick:req.nextTick,onError:c,configure:function(e){e.baseUrl&&"/"!==e.baseUrl.charAt(e.baseUrl.length-1)&&(e.baseUrl+="/");var t=w.pkgs,n=w.shim,i={paths:!0,config:!0,map:!0};eachProp(e,function(e,t){i[t]?"map"===t?(w.map||(w.map={}),mixin(w[t],e,!0,!0)):mixin(w[t],e,!0):w[t]=e}),e.shim&&(eachProp(e.shim,function(e,t){isArray(e)&&(e={deps:e}),!e.exports&&!e.init||e.exportsFn||(e.exportsFn=b.makeShimExports(e)),n[t]=e}),w.shim=n),e.packages&&(each(e.packages,function(e){var n;e="string"==typeof e?{name:e}:e,n=e.location,t[e.name]={name:e.name,location:n||e.name,main:(e.main||"main").replace(currDirRegExp,"").replace(jsSuffixRegExp,"")}}),w.pkgs=t),eachProp(T,function(e,t){e.inited||e.map.unnormalized||(e.map=a(t))}),(e.deps||e.callback)&&b.require(e.deps||[],e.callback)},makeShimExports:function(e){function t(){var t;return e.init&&(t=e.init.apply(global,arguments)),t||e.exports&&getGlobal(e.exports)}return t},makeRequire:function(t,i){function r(n,s,u){var l,d,h;return i.enableBuildCallback&&s&&isFunction(s)&&(s.__requireJsBuild=!0),"string"==typeof n?isFunction(s)?c(makeError("requireargs","Invalid require call"),u):t&&hasProp(M,n)?M[n](T[t.id]):req.get?req.get(b,n,t,r):(d=a(n,t,!1,!0),l=d.id,hasProp(Y,l)?Y[l]:c(makeError("notloaded",'Module name "'+l+'" has not been loaded yet for context: '+e+(t?"":". Use require([])")))):(g(),b.nextTick(function(){g(),h=o(a(null,t)),h.skipMap=i.skipMap,h.init(n,s,u,{enabled:!0}),p()}),r)}return i=i||{},mixin(r,{isBrowser:isBrowser,toUrl:function(e){var i,r=e.lastIndexOf("."),s=e.split("/")[0],a="."===s||".."===s;return-1!==r&&(!a||r>1)&&(i=e.substring(r,e.length),e=e.substring(0,r)),b.nameToUrl(n(e,t&&t.id,!0),i,!0)},defined:function(e){return hasProp(Y,a(e,t,!1,!0).id)},specified:function(e){return e=a(e,t,!1,!0).id,hasProp(Y,e)||hasProp(T,e)}}),t||(r.undef=function(e){l();var n=a(e,t,!0),i=getOwn(T,e);delete Y[e],delete P[n.url],delete S[e],i&&(i.events.defined&&(S[e]=i.events),d(e))}),r},enable:function(e){var t=getOwn(T,e.id);t&&o(e).enable()},completeLoad:function(e){var t,n,i,s=getOwn(w.shim,e)||{},a=s.exports;for(l();D.length;){if(n=D.shift(),null===n[0]){if(n[0]=e,t)break;t=!0}else n[0]===e&&(t=!0);f(n)}if(i=getOwn(T,e),!t&&!hasProp(Y,e)&&i&&!i.inited){if(!(!w.enforceDefine||a&&getGlobal(a)))return r(e)?void 0:c(makeError("nodefine","No define call for "+e,null,[e]));f([e,s.deps||[],s.exportsFn])}p()},nameToUrl:function(e,t,n){var i,r,s,a,o,u,c,l,d;if(req.jsExtRegExp.test(e))l=e+(t||"");else{for(i=w.paths,r=w.pkgs,o=e.split("/"),u=o.length;u>0;u-=1){if(c=o.slice(0,u).join("/"),s=getOwn(r,c),d=getOwn(i,c)){isArray(d)&&(d=d[0]),o.splice(0,u,d);break}if(s){a=e===s.name?s.location+"/"+s.main:s.location,o.splice(0,u,a);break}}l=o.join("/"),l+=t||(/\?/.test(l)||n?"":".js"),l=("/"===l.charAt(0)||l.match(/^[\w\+\.\-]+:/)?"":w.baseUrl)+l}return w.urlArgs?l+((-1===l.indexOf("?")?"?":"&")+w.urlArgs):l},load:function(e,t){req.load(b,e,t)},execCb:function(e,t,n,exports){return t.apply(exports,n)},onScriptLoad:function(e){if("load"===e.type||readyRegExp.test((e.currentTarget||e.srcElement).readyState)){interactiveScript=null;var t=m(e);b.completeLoad(t.id)}},onScriptError:function(e){var t=m(e);return r(t.id)?void 0:c(makeError("scripterror","Script error for: "+t.id,e,[t.id]))}},b.require=b.makeRequire(),b}function getInteractiveScript(){return interactiveScript&&"interactive"===interactiveScript.readyState?interactiveScript:(eachReverse(scripts(),function(e){return"interactive"===e.readyState?interactiveScript=e:void 0}),interactiveScript)}var req,s,head,baseElement,dataMain,src,interactiveScript,currentlyAddingScript,mainScript,subPath,version="2.1.8",commentRegExp=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,cjsRequireRegExp=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,jsSuffixRegExp=/\.js$/,currDirRegExp=/^\.\//,op=Object.prototype,ostring=op.toString,hasOwn=op.hasOwnProperty,ap=Array.prototype,apsp=ap.splice,isBrowser=!("undefined"==typeof window||!navigator||!window.document),isWebWorker=!isBrowser&&"undefined"!=typeof importScripts,readyRegExp=isBrowser&&"PLAYSTATION 3"===navigator.platform?/^complete$/:/^(complete|loaded)$/,defContextName="_",isOpera="undefined"!=typeof opera&&"[object Opera]"===opera.toString(),contexts={},cfg={},globalDefQueue=[],useInteractive=!1;if("undefined"==typeof define){if("undefined"!=typeof requirejs){if(isFunction(requirejs))return;cfg=requirejs,requirejs=void 0}"undefined"==typeof require||isFunction(require)||(cfg=require,require=void 0),req=requirejs=function(e,t,n,i){var r,s,a=defContextName;return isArray(e)||"string"==typeof e||(s=e,isArray(t)?(e=t,t=n,n=i):e=[]),s&&s.context&&(a=s.context),r=getOwn(contexts,a),r||(r=contexts[a]=req.s.newContext(a)),s&&r.configure(s),r.require(e,t,n)},req.config=function(e){return req(e)},req.nextTick="undefined"!=typeof setTimeout?function(e){setTimeout(e,4)}:function(e){e()},require||(require=req),req.version=version,req.jsExtRegExp=/^\/|:|\?|\.js$/,req.isBrowser=isBrowser,s=req.s={contexts:contexts,newContext:newContext},req({}),each(["toUrl","undef","defined","specified"],function(e){req[e]=function(){var t=contexts[defContextName];return t.require[e].apply(t,arguments)}}),isBrowser&&(head=s.head=document.getElementsByTagName("head")[0],baseElement=document.getElementsByTagName("base")[0],baseElement&&(head=s.head=baseElement.parentNode)),req.onError=defaultOnError,req.createNode=function(e){var t=e.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script");return t.type=e.scriptType||"text/javascript",t.charset="utf-8",t.async=!0,t},req.load=function(e,t,n){var i,r=e&&e.config||{};if(isBrowser)return i=req.createNode(r,t,n),i.setAttribute("data-requirecontext",e.contextName),i.setAttribute("data-requiremodule",t),!i.attachEvent||i.attachEvent.toString&&i.attachEvent.toString().indexOf("[native code")<0||isOpera?(i.addEventListener("load",e.onScriptLoad,!1),i.addEventListener("error",e.onScriptError,!1)):(useInteractive=!0,i.attachEvent("onreadystatechange",e.onScriptLoad)),i.src=n,currentlyAddingScript=i,baseElement?head.insertBefore(i,baseElement):head.appendChild(i),currentlyAddingScript=null,i;if(isWebWorker)try{importScripts(n),e.completeLoad(t)}catch(s){e.onError(makeError("importscripts","importScripts failed for "+t+" at "+n,s,[t]))}},isBrowser&&eachReverse(scripts(),function(e){return head||(head=e.parentNode),dataMain=e.getAttribute("data-main"),dataMain?(mainScript=dataMain,cfg.baseUrl||(src=mainScript.split("/"),mainScript=src.pop(),subPath=src.length?src.join("/")+"/":"./",cfg.baseUrl=subPath),mainScript=mainScript.replace(jsSuffixRegExp,""),req.jsExtRegExp.test(mainScript)&&(mainScript=dataMain),cfg.deps=cfg.deps?cfg.deps.concat(mainScript):[mainScript],!0):void 0}),define=function(e,t,n){var i,r;"string"!=typeof e&&(n=t,t=e,e=null),isArray(t)||(n=t,t=null),!t&&isFunction(n)&&(t=[],n.length&&(n.toString().replace(commentRegExp,"").replace(cjsRequireRegExp,function(e,n){t.push(n)}),t=(1===n.length?["require"]:["require","exports","module"]).concat(t))),useInteractive&&(i=currentlyAddingScript||getInteractiveScript(),i&&(e||(e=i.getAttribute("data-requiremodule")),r=contexts[i.getAttribute("data-requirecontext")])),(r?r.defQueue:globalDefQueue).push([e,t,n])},define.amd={jQuery:!0},req.exec=function(text){return eval(text)},req(cfg)}}(this);