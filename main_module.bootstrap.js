var digestsPath = 'require_digest_path.json'

function requestDigits(callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", digestsPath, false);
    xmlHttp.onload = function (e) {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200 || xmlHttp.status == 0) {
              callback(xmlHttp.responseText)
            } else {
              console.error('Request digits response status is not 200', xmlHttp.status)
              callback()
            }
        }
    }
    xmlHttp.onerror = function (error) {
      callback(undefined, error)
    }
    xmlHttp.send(null);
}
if (!window.flutLabLoadInjector) {
  /**
   * Broadcasting message to parent window
   *  
   * @param {string} type
   * @param {any=} [data]
  **/
  function broadcastMessage(type, data = undefined) {
    const object = {
      sender: 'frame', 
      type: type,
    }
    if (data) {
      object.data = data
    }
    // console.log('Broadcasting message', object)
    window.parent && window.parent.postMessage(object, '*')
  }
  
  window.flutLabInjector = new class {
    constructor() {
      this.modulesToLoad = 0
      this.currentLoadCounter = 0
    }
  
    onModuleLoaded(module) {
      ++this.currentLoadCounter
      broadcastMessage('onModuleLoaded', {
        name: module,
        progress: this.currentLoadCounter,
        max: this.modulesToLoad
      })
    }
  
    onModuleLoadFailed(module, error) {
      ++this.currentLoadCounter
      broadcastMessage('onModuleLoadFailed', {
        name: module,
        error: error,
      })
    }
  
    onRestart(modulesCount) {
      this.modulesToLoad = modulesCount
      this.currentLoadCounter = 0
      broadcastMessage('onRestartStarted', {
        modulesCount: modulesCount
      })
    }
  
    onRunMain() {
      broadcastMessage('onRunMain')
    }
    
    onRequireJSFailure(type, modules) {
      broadcastMessage('onRequireJSFailure', {
        type: type,
        modules: modules,
      })
    }
  }()
}
// requireType: A string value with a general classification, like "timeout", "nodefine", "scripterror".
// requireModules: an array of module names/URLs that timed out.
requirejs.onError = function (err) {
  window.flutLabInjector.onRequireJSFailure(err.requireType, err.requireModules)
}
require.config({
  waitSeconds : 120,
  catchError: true,
  paths: {
    dart_sdk: 'https://api.flutlab.io/res/dart_static/dart_sdk_2_14_4'
  },
  onNodeCreated: function(node, config, moduleName, url) {
    node.addEventListener('load', function() {
      window.flutLabInjector.onModuleLoaded(moduleName)
    });

    node.addEventListener('error', function(eventj) {
      window.flutLabInjector.onModuleLoadFailed(moduleName, event)
    });
  },
});
function _initDebug() {
  // Create the main module loaded below.
  define("main_module.bootstrap", ["web_entrypoint.dart", "dart_sdk"], function(app, dart_sdk) {
    window.dart_sdk = dart_sdk
    dart_sdk.dart.setStartAsyncSynchronously(true);
    dart_sdk._debugger.registerDevtoolsFormatter();
    dart_sdk.dart.nonNullAsserts(false);
    dart_sdk.dart.nativeNonNullAsserts(false);
    dart_sdk.developer.postEvent = () => {}
  
    // See the generateMainModule doc comment.
    var child = {};
    child.main = function() {
      window.flutLabInjector.onRunMain()
      app[Object.keys(app)[0]].main();
    }
  
    // Hi, Flutter Team. We are glad that you have come here :)
    if(!window.$dwdsInitialized) {
      window.$dwdsInitialized = true;
      window.$dartMainTearOffs = [child.main];
      window.$dartRunMain = function() {
        window.$dartMainExecuted = true;
        window.$dartMainTearOffs.forEach(function(main){
           main();
        });
      }
      window.$dartAppId = "hFy32D/7xU6ZkcAJWipZew==";
      window.$dartReloadConfiguration = "ReloadConfiguration.none";
      window.$dartModuleStrategy = "require-js";
      window.$loadModuleConfig = require;
      window.$dwdsVersion = "7.1.1";
    // window.$dwdsDevHandlerPath = "http://localhost:55452/$dwdsSseHandler";
      window.$dartEntrypointPath = "main_module.bootstrap.js";
      window.$requireLoader.forceLoadModule("dwds_client");
    // window.$dartExtensionUri = "http://127.0.0.1:55455/$debug";
    } else {
      if(window.$dartMainExecuted) {
       child.main();
      } else {
       window.$dartMainTearOffs.push(child.main);
      }
    }
    
    window.$dartLoader = {};
    window.$dartLoader.rootDirectories = [];
    if (window.$requireLoader) {
      window.$requireLoader.getModuleLibraries = dart_sdk.dart.getModuleLibraries;
    }
     if (window.$dartStackTraceUtility && !window.$dartStackTraceUtility.ready) {
       window.$dartStackTraceUtility.ready = true;
       let dart = dart_sdk.dart;
       window.$dartStackTraceUtility.setSourceMapProvider(function(url) {
         var baseUrl = window.location.protocol + '//' + window.location.host;
         var lastSlashIndex = window.location.pathname.lastIndexOf("/");
         baseUrl += window.location.pathname.substr(0, lastSlashIndex);
         url = url.replace(baseUrl + '/', '');
         if (url == 'dart_sdk.js') {
           return dart.getSourceMap('dart_sdk');
         }
         url = url.replace(".js", "");
         return dart.getSourceMap(url);
       });
     }
  });
  
  if(!window.$requireLoader) {
     window.$requireLoader = {
       digestsPath: digestsPath,
       // Used in package:build_runner/src/server/build_updates_client/hot_reload_client.dart
       moduleParentsGraph: new Map(),
       forceLoadModule: function (modulePath, callback, onError) {
        //  let moduleName = moduleNames[modulePath];
        //  if (moduleName == null) {
           var moduleName = modulePath;
        //  }
         requirejs.undef(moduleName);
         try{
          requirejs([moduleName], function() {
            if (typeof callback != 'undefined') {
              callback();
            }
          });
         } catch (error) {
          if (typeof onError != 'undefined') {
            onError(error);
          }else{
            throw(error);
          }
         }
       },
       getModuleLibraries: null, // set up by _initializeTools
     };
  }
  const modulesGraph = new Map();
  requirejs.onResourceLoad = function (context, map, depArray) {
    const name = map.name;
    const depNameArray = depArray.map((dep) => dep.name);
    if (modulesGraph.has(name)) {
      var previousDeps = modulesGraph.get(name);
      var changed = previousDeps.length != depNameArray.length;
      changed = changed || depNameArray.some(function(depName) {
        return !previousDeps.includes(depName);
      });
      if (changed) {
        console.warn("Dependencies graph change for module '" + name + "' detected. " +
          "Dependencies was [" + previousDeps + "], now [" +  depNameArray.map((depName) => depName) +"]. " +
          "Page can't be hot-reloaded, firing full page reload.");
        // FixMe 
        // window.location.reload();
      }
    } else {
      modulesGraph.set(name, []);
      for (const depName of depNameArray) {
        if (!$requireLoader.moduleParentsGraph.has(depName)) {
          $requireLoader.moduleParentsGraph.set(depName, []);
        }
        $requireLoader.moduleParentsGraph.get(depName).push(name);
        modulesGraph.get(name).push(depName);
      }
    }
  };
}
requestDigits((digits, error) => {
  if (!error) {
    if (digits) {
      try {
        var modules = JSON.parse(digits)
      } catch (e) {
        console.error('Parse digits failed', e)
      }
      if (modules) {
        try {
          var modulesCount = Object.keys(modules).length
        } catch (e) {
          console.error('Failed to get modules count', e)
        }
        if (modulesCount) {
          window.flutLabInjector.onRestart(modulesCount)
        }
      }
    }
  } else {
    console.error('Request digits failed', error)
  }
  _initDebug()
})
