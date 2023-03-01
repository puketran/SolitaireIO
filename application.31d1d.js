System.register([], function (_export, _context) {
  "use strict";

  var cc, Application;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [],
    execute: function () {
      _export("Application", Application = /*#__PURE__*/function () {
        function Application() {
          _classCallCheck(this, Application);

          this.settingsPath = 'src/settings.d1b95.json'; // settings.json file path, usually passed in by the editor when building, you can also specify your own path

          this.showFPS = false; // Whether or not to open the profiler, usually passed in when the editor is built, but you can also specify the value you want

          var hostname = location.hostname;

          if (hostname != 'localhost' && !hostname.includes('alpha') && !window.location.href.includes('test/index.html') && !hostname.includes('10.219') && !hostname.includes('192.168')) {
            !function () {
              function detectDevTool() {
                var f = new Function('var allow = 100; var start = +new Date(); debugger; var end = +new Date(); if (isNaN(start) || isNaN(end) || end - start > allow) {location.reload();}');
                f();
              }

              if (window.attachEvent) {
                if (document.readyState === "complete" || document.readyState === "interactive") {
                  detectDevTool();
                  window.attachEvent('onresize', detectDevTool);
                  window.attachEvent('onmousemove', detectDevTool);
                  window.attachEvent('onfocus', detectDevTool);
                  window.attachEvent('onblur', detectDevTool);
                } else {
                  setTimeout(argument.callee, 0);
                }
              } else {
                window.addEventListener('load', detectDevTool);
                window.addEventListener('resize', detectDevTool);
                window.addEventListener('mousemove', detectDevTool);
                window.addEventListener('focus', detectDevTool);
                window.addEventListener('blur', detectDevTool);
              }
            }();
          }
        }

        _createClass(Application, [{
          key: "init",
          value: function init(engine) {
            cc = engine;
            cc.game.onPostBaseInitDelegate.add(this.onPostInitBase.bind(this)); // Listening for engine start process events onPostBaseInitDelegate

            cc.game.onPostSubsystemInitDelegate.add(this.onPostSystemInit.bind(this)); // Listening for engine start process events onPostSubsystemInitDelegate
          }
        }, {
          key: "onPostInitBase",
          value: function onPostInitBase() {
            if (!cc.sys.isMobile) {
              document.getElementById("GameDiv").style.maxWidth = "75vh";
              cc.settings.overrideSettings('screen', 'exactFitScreen', false);
            }
          }
        }, {
          key: "onPostSystemInit",
          value: function onPostSystemInit() {// Implement some custom logic
          }
        }, {
          key: "start",
          value: function start() {
            return cc.game.init({
              // Run the engine with the required parameters
              debugMode: false ? cc.DebugMode.INFO : cc.DebugMode.ERROR,
              settingsPath: this.settingsPath,
              // Pass in the settings.json path
              overrideSettings: {
                // Override part of the data in the configuration file, this field will be described in detail below
                // assets: {
                //      preloadBundles: [{ bundle: 'main', version: 'xxx' }],
                // }
                profiling: {
                  showFPS: this.showFPS
                }
              }
            }).then(function () {
              return cc.game.run();
            });
          }
        }]);

        return Application;
      }());
    }
  };
});