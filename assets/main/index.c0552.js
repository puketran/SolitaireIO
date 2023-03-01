System.register("chunks:///_virtual/main",["./NewComponent.ts"],(function(){"use strict";return{setters:[null],execute:function(){}}}));

System.register("chunks:///_virtual/NewComponent.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(t){"use strict";var n,e,o,r;return{setters:[function(t){n=t.inheritsLoose},function(t){e=t.cclegacy,o=t._decorator,r=t.Component}],execute:function(){var c;e._RF.push({},"7165cYXDcBA4IwSDTop5xfk","NewComponent",void 0);var u=o.ccclass;o.property,t("NewComponent",u("NewComponent")(c=function(t){function e(){return t.apply(this,arguments)||this}n(e,t);var o=e.prototype;return o.start=function(){},o.update=function(t){},e}(r))||c);e._RF.pop()}}}));

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});