import {
  __commonJS
} from "./chunk-D62JG4L6.js";

// node_modules/react-facebook-pixel/dist/fb-pixel.js
var require_fb_pixel = __commonJS({
  "node_modules/react-facebook-pixel/dist/fb-pixel.js"(exports, module) {
    !function(t, e) {
      "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.ReactPixel = e() : t.ReactPixel = e();
    }(window, function() {
      return function(t) {
        var e = {};
        function n(o) {
          if (e[o])
            return e[o].exports;
          var r = e[o] = { i: o, l: false, exports: {} };
          return t[o].call(r.exports, r, r.exports, n), r.l = true, r.exports;
        }
        return n.m = t, n.c = e, n.d = function(t2, e2, o) {
          n.o(t2, e2) || Object.defineProperty(t2, e2, { enumerable: true, get: o });
        }, n.r = function(t2) {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t2, "__esModule", { value: true });
        }, n.t = function(t2, e2) {
          if (1 & e2 && (t2 = n(t2)), 8 & e2)
            return t2;
          if (4 & e2 && "object" == typeof t2 && t2 && t2.__esModule)
            return t2;
          var o = /* @__PURE__ */ Object.create(null);
          if (n.r(o), Object.defineProperty(o, "default", { enumerable: true, value: t2 }), 2 & e2 && "string" != typeof t2)
            for (var r in t2)
              n.d(o, r, (function(e3) {
                return t2[e3];
              }).bind(null, r));
          return o;
        }, n.n = function(t2) {
          var e2 = t2 && t2.__esModule ? function() {
            return t2.default;
          } : function() {
            return t2;
          };
          return n.d(e2, "a", e2), e2;
        }, n.o = function(t2, e2) {
          return Object.prototype.hasOwnProperty.call(t2, e2);
        }, n.p = "", n(n.s = 0);
      }([function(t, e, n) {
        t.exports = n(1);
      }, function(t, e, n) {
        "use strict";
        function o(t2) {
          return function(t3) {
            if (Array.isArray(t3)) {
              for (var e2 = 0, n2 = new Array(t3.length); e2 < t3.length; e2++)
                n2[e2] = t3[e2];
              return n2;
            }
          }(t2) || function(t3) {
            if (Symbol.iterator in Object(t3) || "[object Arguments]" === Object.prototype.toString.call(t3))
              return Array.from(t3);
          }(t2) || function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance");
          }();
        }
        n.r(e);
        var r = !!window.fbq, i = false, a = function() {
          var t2;
          if (i) {
            for (var e2 = arguments.length, n2 = new Array(e2), r2 = 0; r2 < e2; r2++)
              n2[r2] = arguments[r2];
            (t2 = console).info.apply(t2, o(["[react-facebook-pixel]"].concat(n2)));
          }
        }, c = function() {
          var t2;
          if (i) {
            for (var e2 = arguments.length, n2 = new Array(e2), r2 = 0; r2 < e2; r2++)
              n2[r2] = arguments[r2];
            (t2 = console).info.apply(t2, o(["[react-facebook-pixel]"].concat(n2)));
          }
        }, f = function() {
          return r || a("Pixel not initialized before using call ReactPixel.init with required params"), r;
        }, u = { autoConfig: true, debug: false };
        e.default = { init: function(t2) {
          var e2, n2, o2, c2, f2, l, d = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : u;
          e2 = window, n2 = document, o2 = "script", e2.fbq || (c2 = e2.fbq = function() {
            c2.callMethod ? c2.callMethod.apply(c2, arguments) : c2.queue.push(arguments);
          }, e2._fbq || (e2._fbq = c2), c2.push = c2, c2.loaded = true, c2.version = "2.0", c2.queue = [], (f2 = n2.createElement(o2)).async = true, f2.src = "https://connect.facebook.net/en_US/fbevents.js", (l = n2.getElementsByTagName(o2)[0]).parentNode.insertBefore(f2, l)), t2 ? (false === s.autoConfig && fbq("set", "autoConfig", false, t2), fbq("init", t2, d), r = true, i = s.debug) : a("Please insert pixel id for initializing");
        }, pageView: function() {
          f() && (fbq("track", "PageView"), i && c("called fbq('track', 'PageView');"));
        }, track: function(t2, e2) {
          f() && (fbq("track", t2, e2), i && (c("called fbq('track', '".concat(t2, "');")), e2 && c("with data", e2)));
        }, trackSingle: function(t2, e2, n2) {
          f() && (fbq("trackSingle", t2, e2, n2), i && (c("called fbq('trackSingle', '".concat(t2, "', '").concat(e2, "');")), n2 && c("with data", n2)));
        }, trackCustom: function(t2, e2) {
          f() && (fbq("trackCustom", t2, e2), i && (c("called fbq('trackCustom', '".concat(t2, "');")), e2 && c("with data", e2)));
        }, trackSingleCustom: function(t2, e2, n2) {
          f() && (fbq("trackSingle", t2, e2, n2), i && (c("called fbq('trackSingleCustom', '".concat(t2, "', '").concat(e2, "');")), n2 && c("with data", n2)));
        }, grantConsent: function() {
          f() && (fbq("consent", "grant"), i && c("called fbq('consent', 'grant');"));
        }, revokeConsent: function() {
          f() && (fbq("consent", "revoke"), i && c("called fbq('consent', 'revoke');"));
        }, fbq: function(t2) {
          function e2() {
            return t2.apply(this, arguments);
          }
          return e2.toString = function() {
            return t2.toString();
          }, e2;
        }(function() {
          if (f()) {
            for (var t2 = arguments.length, e2 = new Array(t2), n2 = 0; n2 < t2; n2++)
              e2[n2] = arguments[n2];
            fbq.apply(void 0, e2), i && (c("called fbq('".concat(e2.slice(0, 2).join("', '"), "')")), e2[2] && c("with data", e2[2]));
          }
        }) };
      }]);
    });
  }
});
export default require_fb_pixel();
//# sourceMappingURL=react-facebook-pixel.js.map
